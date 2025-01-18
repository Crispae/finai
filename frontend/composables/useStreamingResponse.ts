import { ref } from 'vue'

export function useStreamingResponse() {
  const isLoading = ref(false)

  const handleStreamingResponse = async ( response: Response, onChunk: (content: string) => void, onError: (error: string) => void ) => 

{
    const reader = response.body?.getReader()
    
    if (!reader) throw new Error('Response body is not readable')

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          isLoading.value = false
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'assistant' && data.content) {
                onChunk(data.content)
              } else if (data.type === 'error') {
                onError(data.content)
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e, line)
            }
          }
        }
      }
    } catch (error) {
      isLoading.value = false
      throw error
    }
  }

  return {
    isLoading,
    handleStreamingResponse
  }
}
import os
import time
from neo4j import GraphDatabase

# Read environment variables
NEO4J_URI = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASS = os.environ.get("NEO4J_PASS", "secret")

print("Connecting to:", NEO4J_URI)
print("Using credentials user:", NEO4J_USER, "password:", NEO4J_PASS)

# Retry logic to wait for Neo4j to be ready
retries = 0
while True:
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))
        # Attempt a test connection
        with driver.session() as test_session:
            test_session.run("RETURN 1")
        print("Connection is established.")
        break
    except Exception as e:
        print(f"Received error: {e}")
        retries += 1
        pause = 2 * 2 ** retries  # exponential backoff
        print(f"Trying again in {pause} seconds...")
        time.sleep(pause)

# List of sample cypher commands
cypher_commands = [
"""CREATE (n5:Position {type: "President"})<-[:has_role]-(:Person {first_name: "Emanuel ", last_name: "Le Macron"})-[:belongs_to]->(:`Political Party` {name: "Renaissance"})-[:has_direction]->(n7:Direction {type: "liberal"})-[:has_value]->(:Value {description: "Social inclusion"})""",
"""(n5)<-[:wants_role]-(:Person {first_name: "Marine", last_name: "Le Pen"})-[:belongs_to]->(:`Political Party` {name: "National Rally"})-[:has_direction]->(n22:Direction {type: "Far Right"})-[:has_value]->(n23:Value {description: "Nationalism"})-[:has_influence_to]->(n31:Goal {description: "Withdrawing from or significantly negotiating EU agreements."})<-[:has_influence_to]-(n27:Value {description: "Protectionism"})-[:has_influence_to]->(n32:Goal {description: "Halting immigration and increasing border controls."})-[:introduces_consequence]->(:Consequence {description: "Short-Term Economic Downturn: The focus on nationalism and immigration restrictions could lead to a tightened labor market, affecting industries that depend on foreign workers. This, combined with potential trade disruptions, could result in short-term economic stagnation or even recession."})""",
"""(n36:Consequence {description: "Positive for Market Confidence: Macron’s focus on economic reforms, market liberalization, and pro-EU policies would likely reassure investors. The belief that France will remain a strong, stable player within the European Union and the global market would attract foreign investment."})<-[:introduces_consequence]-(n30:Goal {description: "Strengthening France's role within the EU."})<-[:has_influence_to]-(n20:Value {description: "Pro-European Union"})-[:has_influence_to]->(n29:Goal {description: "Labor market flexibility and pension reform."})<-[:has_influence_to]-(n17:Value {description: "Progressivism"})<-[:has_value]-(n7)-[:has_value]->(:Value {description: "Centrism"})""",
"""(n20)<-[:has_value]-(n7)-[:has_value]->(:Value {description: "Economic liberalism"})-[:has_influence_to]->(n28:Goal {description: "Economic reform to enhance investment and growth."})-[:introduces_consequence]->(n36)""",
"""(n40:Consequence {description: "Volatility and Market Uncertainty: Le Pen’s euroskepticism, especially the possibility of a Frexit (France leaving the EU), would introduce significant uncertainty. Investors generally dislike unpredictability, and the idea of France leaving the EU would likely lead to market volatility and a weakened euro."})<-[:introduces_consequence]-(n31)<-[:has_influence_to]-(:Value {description: "Euroskepticism"})<-[:has_value]-(n22)-[:has_value]->(:Value {description: "Populism"})-[:has_influence_to]->(n32)""",
"""(n23)-[:has_influence_to]->(n33:Goal {description: "Protectionist economic policies, including french businesses."})<-[:has_influence_to]-(n27)<-[:has_value]-(n22)-[:has_value]->(n26:Value {description: "Cultural conservatism"})-[:has_influence_to]->(n32)""",
"""(n17)-[:has_influence_to]->(:Goal {description: "Environmental sustainability initiatives."})-[:introduces_consequence]->(n39:Consequence {description: "Risk of Fiscal Deficits: Though Macron’s pro-business stance could support growth, ongoing fiscal deficits and government spending, particularly on social welfare and environmental initiatives, could weigh on public debt. Markets may be cautious of a rising debt-to-GDP ratio, particularly if economic growth slows."})""",
"""(n27)-[:has_influence_to]->(:Goal {description: "Supporting social welfare, but primarily for French nationals."})<-[:has_influence_to]-(n26)""",
"""(n39)<-[:introduces_consequence]-(n28)-[:introduces_consequence]->(:Consequence {description: "Growth and Innovation: Policies designed to modernize France’s economy, encourage investment, and lower corporate tax rates could stimulate economic growth. This could lead to stock market optimism, especially in sectors that benefit from innovation, such as tech, green energy, and infrastructure."})""",
"""(n30)-[:introduces_consequence]->(:Consequence {description: "Stability in the Eurozone: Macron’s commitment to the EU and maintaining close ties with European institutions would likely help maintain stability in the Eurozone, benefiting French assets, particularly the euro, French government bonds, and French companies operating in global markets."})""",
"""(n29)-[:introduces_consequence]->(n39)""",
"""(n42:Consequence {description: "Rising Borrowing Costs: The fear of economic isolation could lead to higher borrowing costs for the French government. Bond yields might rise as investors demand higher returns to compensate for the risk associated with an uncertain political future. A potential exit from the EU could undermine investor confidence in French debt."})<-[:introduces_consequence]-(n31)-[:introduces_consequence]->(:Consequence {description: "Falling Stock Markets: Markets would likely react negatively to the prospects of a Frexit or a France distanced from the EU’s single market. Companies that rely on European trade and investment may experience stock price declines. International investors might pull out of French equities due to concerns about trade barriers, regulatory uncertainty, and higher political risks."})<-[:introduces_consequence]-(n33)-[:introduces_consequence]->(n40)""",
"""(n33)-[:introduces_consequence]->(n42)"""
]

# Run the seeding commands
while True:
    try:
        with driver.session() as session:
            for command in cypher_commands:
                session.run(command)
        print("Seeding complete!")
        break
    except Exception as e:
        print(f"Received error: {e}")
        retries += 1
        pause = 2 * 2 ** retries
        print(f"Trying again in {pause} seconds...")
        time.sleep(pause)

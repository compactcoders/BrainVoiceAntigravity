import re

file_path = 'c:/Users/Renusri/Downloads/Brainvoice-main/Brainvoice-main/index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.write

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Hero replacement
html = re.sub(
    r'People no longer just type—they speak\. Brainvoice uses AI to analyze.*?how they say it, and what it means\.',
    'Brainvoice.AI is a cutting-edge digital marketing analytical and IT company dedicated to revolutionizing the way of digital marketing for organizations. With a deep-rooted passion for data-driven insights, we empower organizations to increase SALES & BRAND awareness. We revolutionize the way businesses achieve their marketing goals with the power of AI.',
    html, flags=re.DOTALL
)

# Feature 1
html = html.replace('Visibility\n\t\t\t\t\t\t\t\t\t\t\t\t\tanalysis', 'Descriptive Analytics')
html = html.replace('Visibility\n<<<<<<< HEAD', 'Descriptive Analytics') # just in case
html = re.sub(r'<h3[^>]*>Visibility[ \n\t]+analysis</h3>', '<h3 class="supertitle min-h-7 leading-0 flex items-center">Descriptive Analytics</h3>', html)
html = re.sub(
    r'See when your brand appears in AI responses, how prominently.*?alongside you over time\.',
    'We revolutionize the way businesses achieve their marketing goals with the power of AI, leveraging data to drive strategic insight.',
    html, flags=re.DOTALL
)

# Feature 2
html = re.sub(r'<h3[^>]*>Sentiment[ \n\t]+insight</h3>', '<h3 class="supertitle min-h-7 leading-0 flex items-center">Diagnostic Analytics</h3>', html)
html = re.sub(
    r'Understand how AI describes your brand\. The language it uses, the.*?trust signals it relies on\.',
    'Gain deeper insights into the factors influencing your business performance, empowering faster and smarter decision making.',
    html, flags=re.DOTALL
)

# Feature 3
html = re.sub(r'<h3[^>]*>Actionable[ \n\t]+direction</h3>', '<h3 class="supertitle min-h-7 leading-0 flex items-center">Advanced Analytical Services</h3>', html)
html = re.sub(
    r'Identify where visibility is strong, where it drops away and where.*?AI\n\t*.*engines surface your brand\.',
    'Identify marketing opportunities, optimize campaigns, and develop comprehensive data-driven strategies for long-term growth.',
    html, flags=re.DOTALL
)
# Wait, let's just use a more robust regex for the actionable direction part
html = re.sub(
    r'Identify where visibility is strong, where it drops away and where.*?engines surface your brand\.',
    'Identify marketing opportunities, optimize campaigns, and develop comprehensive data-driven strategies for long-term growth.',
    html, flags=re.DOTALL
)

# Sliders
html = re.sub(r'<h4 class="is-h2">Marketing <br />Teams</h4>', '<h4 class="is-h2">E-Commerce<br />Solutions</h4>', html)
html = re.sub(
    r'Use Brainvoice to analyze conversations and data.*?content, messaging, and marketing strategies\.',
    'Use Brainvoice to elevate your online retail growth with comprehensive analytics, accelerating your marketing and increasing brand awareness.',
    html, flags=re.DOTALL
)

html = re.sub(r'<h4 class="is-h2">Agencies<br /><br /></h4>', '<h4 class="is-h2">FMCG &<br />Retail</h4>', html)
html = re.sub(
    r'Benchmark clients clearly, support GEO strategies.*?metrics through shared dashboards and reporting\.',
    'Empower your consumer brands with actionable digital marketing intelligence. Track product performance and optimize consumer engagement seamlessly.',
    html, flags=re.DOTALL
)

html = re.sub(r'<h4 class="is-h2">Brand <br />Managers</h4>', '<h4 class="is-h2">Consumer <br />Apps</h4>', html)
html = re.sub(
    r'Track how AI speaks about your brand across.*?over time\.',
    'Drive mobile app growth by leveraging diagnostic analytics and optimizing digital acquisition to stay ahead of the competition.',
    html, flags=re.DOTALL
)

html = re.sub(r'<h4 class="is-h2">Business <br />leaders</h4>', '<h4 class="is-h2">Healthcare <br />& BFSI</h4>', html)
html = re.sub(
    r'Gain a clearer view of market perception,.*?compare\.',
    'Empower your institutions with robust, data-driven insights. Streamline operations and enhance your strategic market positioning.',
    html, flags=re.DOTALL
)

# Footer description
html = re.sub(
    r'Brainvoice helps organizations understand conversations through.*?AI\..*?By analyzing voice interactions, it uncovers insights hidden in human speech\.',
    'Brainvoice.AI is a cutting-edge digital marketing analytical and IT company dedicated to revolutionizing the way organizations achieve business growth and expansion.',
    html, flags=re.DOTALL
)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Done")

export interface OsintNode {
  id: string
  name: string
  url?: string
  tool?: boolean
  registration?: boolean
  darkweb?: boolean
  manual?: boolean
  children?: OsintNode[]
}

export const osintData: OsintNode = {
  id: "osint-framework",
  name: "OSINT Framework",
  children: [
    {
      id: "username",
      name: "Username",
      children: [
        {
          id: "username-search-engines",
          name: "Username Search Engines",
          children: [
            { id: "whatsmyname", name: "WhatsMyName", url: "https://whatsmyname.app/" },
            { id: "namechk", name: "Namechk", url: "https://namechk.com/" },
            { id: "knowem", name: "KnowEm", url: "https://knowem.com/" },
            { id: "namecheckr", name: "NameCheckr", url: "https://www.namecheckr.com/" },
            { id: "usersearch", name: "UserSearch.org", url: "https://usersearch.org/" },
            {
              id: "whatsmyname-t",
              name: "WhatsMyName (T)",
              url: "https://github.com/WebBreacher/WhatsMyName",
              tool: true,
            },
            { id: "whatsmyname-2", name: "WhatsMyName", url: "https://whatsmyname.app/" },
            { id: "thats-them", name: "Thats Them", url: "https://thatsthem.com/", registration: true },
            { id: "check-usernames", name: "Check Usernames", url: "https://checkusernames.com/" },
            { id: "namecheckup", name: "NameCheckup", url: "https://namecheckup.com/" },
            { id: "instant-username-search", name: "Instant Username Search", url: "https://instantusername.com/" },
            { id: "names-directory", name: "Names Directory", url: "https://namesdirectory.com/" },
          ],
        },
        {
          id: "specific-sites",
          name: "Specific Sites",
          children: [
            { id: "facebook", name: "Facebook", url: "https://www.facebook.com/" },
            { id: "twitter", name: "Twitter/X", url: "https://twitter.com/" },
            { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com/" },
            { id: "instagram", name: "Instagram", url: "https://www.instagram.com/" },
            { id: "reddit", name: "Reddit", url: "https://www.reddit.com/user/" },
            { id: "github", name: "GitHub", url: "https://github.com/" },
          ],
        },
      ],
    },
    {
      id: "email-address",
      name: "Email Address",
      children: [
        {
          id: "email-search",
          name: "Email Search",
          children: [
            { id: "hunter", name: "Hunter.io", url: "https://hunter.io/", registration: true },
            { id: "emailrep", name: "EmailRep", url: "https://emailrep.io/" },
            { id: "haveibeenpwned", name: "Have I Been Pwned", url: "https://haveibeenpwned.com/" },
            { id: "dehashed", name: "DeHashed", url: "https://dehashed.com/", registration: true },
          ],
        },
      ],
    },
    {
      id: "domain-name",
      name: "Domain Name",
      children: [
        {
          id: "whois-records",
          name: "WHOIS Records",
          children: [
            { id: "whois", name: "WHOIS", url: "https://whois.domaintools.com/" },
            { id: "domaintools", name: "DomainTools", url: "https://www.domaintools.com/" },
            { id: "whoxy", name: "Whoxy", url: "https://www.whoxy.com/" },
          ],
        },
        {
          id: "dns-records",
          name: "DNS Records",
          children: [
            { id: "securitytrails", name: "SecurityTrails", url: "https://securitytrails.com/", registration: true },
            { id: "dnsdumpster", name: "DNSdumpster", url: "https://dnsdumpster.com/" },
            { id: "viewdns", name: "ViewDNS.info", url: "https://viewdns.info/" },
          ],
        },
      ],
    },
    {
      id: "ip-mac-address",
      name: "IP & MAC Address",
      children: [
        { id: "shodan", name: "Shodan", url: "https://www.shodan.io/", registration: true },
        { id: "censys", name: "Censys", url: "https://censys.io/", registration: true },
        { id: "greynoise", name: "GreyNoise", url: "https://www.greynoise.io/", registration: true },
        { id: "ipinfo", name: "IPinfo", url: "https://ipinfo.io/" },
      ],
    },
    {
      id: "images-videos-docs",
      name: "Images / Videos / Docs",
      children: [
        {
          id: "reverse-image-search",
          name: "Reverse Image Search",
          children: [
            { id: "google-images", name: "Google Images", url: "https://images.google.com/" },
            { id: "tineye", name: "TinEye", url: "https://tineye.com/" },
            { id: "yandex-images", name: "Yandex Images", url: "https://yandex.com/images/" },
            { id: "bing-images", name: "Bing Images", url: "https://www.bing.com/images/" },
          ],
        },
        {
          id: "exif-data",
          name: "EXIF Data",
          children: [
            { id: "exiftool", name: "ExifTool (T)", url: "https://exiftool.org/", tool: true },
            { id: "exif-viewer", name: "EXIF Viewer", url: "http://exif-viewer.com/" },
          ],
        },
      ],
    },
    {
      id: "social-networks",
      name: "Social Networks",
      children: [
        { id: "facebook-search", name: "Facebook Search", url: "https://www.facebook.com/search/" },
        { id: "twitter-advanced", name: "Twitter Advanced Search", url: "https://twitter.com/search-advanced" },
        { id: "linkedin-search", name: "LinkedIn Search", url: "https://www.linkedin.com/search/" },
        { id: "social-searcher", name: "Social Searcher", url: "https://www.social-searcher.com/" },
      ],
    },
    {
      id: "instant-messaging",
      name: "Instant Messaging",
      children: [
        { id: "telegram-search", name: "Telegram Search", url: "https://telegram.me/" },
        { id: "discord-lookup", name: "Discord Lookup", url: "https://discordlookup.com/" },
      ],
    },
    {
      id: "people-search-engines",
      name: "People Search Engines",
      children: [
        { id: "pipl", name: "Pipl", url: "https://pipl.com/", registration: true },
        { id: "spokeo", name: "Spokeo", url: "https://www.spokeo.com/", registration: true },
        { id: "whitepages", name: "Whitepages", url: "https://www.whitepages.com/" },
        { id: "truepeoplesearch", name: "TruePeopleSearch", url: "https://www.truepeoplesearch.com/" },
      ],
    },
    {
      id: "dating",
      name: "Dating",
      children: [
        { id: "tinder", name: "Tinder", url: "https://tinder.com/", registration: true },
        { id: "okcupid", name: "OkCupid", url: "https://www.okcupid.com/", registration: true },
      ],
    },
    {
      id: "telephone-numbers",
      name: "Telephone Numbers",
      children: [
        { id: "truecaller", name: "Truecaller", url: "https://www.truecaller.com/", registration: true },
        { id: "calleridsearch", name: "CallerID Search", url: "https://calleridservice.com/" },
        { id: "phoneinfoga", name: "PhoneInfoga (T)", url: "https://github.com/sundowndev/phoneinfoga", tool: true },
      ],
    },
    {
      id: "public-records",
      name: "Public Records",
      children: [
        { id: "brbpub", name: "BRB Publications", url: "https://www.brbpublications.com/" },
        { id: "blackbookonline", name: "Black Book Online", url: "https://www.blackbookonline.info/" },
      ],
    },
    {
      id: "business-records",
      name: "Business Records",
      children: [
        { id: "opencorporates", name: "OpenCorporates", url: "https://opencorporates.com/" },
        { id: "crunchbase", name: "Crunchbase", url: "https://www.crunchbase.com/" },
        { id: "linkedin-companies", name: "LinkedIn Companies", url: "https://www.linkedin.com/company/" },
      ],
    },
    {
      id: "transportation",
      name: "Transportation",
      children: [
        { id: "flightradar24", name: "Flightradar24", url: "https://www.flightradar24.com/" },
        { id: "marinetraffic", name: "MarineTraffic", url: "https://www.marinetraffic.com/" },
      ],
    },
    {
      id: "geolocation-tools",
      name: "Geolocation Tools / Maps",
      children: [
        { id: "google-maps", name: "Google Maps", url: "https://maps.google.com/" },
        { id: "google-earth", name: "Google Earth (T)", url: "https://earth.google.com/", tool: true },
        { id: "wikimapia", name: "Wikimapia", url: "https://wikimapia.org/" },
        { id: "openstreetmap", name: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
      ],
    },
    {
      id: "search-engines",
      name: "Search Engines",
      children: [
        { id: "google", name: "Google", url: "https://www.google.com/" },
        { id: "bing", name: "Bing", url: "https://www.bing.com/" },
        { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/" },
        { id: "yandex", name: "Yandex", url: "https://yandex.com/" },
        { id: "baidu", name: "Baidu", url: "https://www.baidu.com/" },
      ],
    },
    {
      id: "forums-blogs-irc",
      name: "Forums / Blogs / IRC",
      children: [
        { id: "boardreader", name: "BoardReader", url: "https://boardreader.com/" },
        { id: "reddit-search", name: "Reddit Search", url: "https://www.reddit.com/search/" },
        { id: "4plebs", name: "4plebs", url: "https://archive.4plebs.org/" },
      ],
    },
    {
      id: "archives",
      name: "Archives",
      children: [
        { id: "wayback-machine", name: "Wayback Machine", url: "https://web.archive.org/" },
        { id: "archive-today", name: "Archive.today", url: "https://archive.today/" },
        { id: "cachedview", name: "CachedView", url: "https://cachedview.com/" },
      ],
    },
    {
      id: "language-translation",
      name: "Language Translation",
      children: [
        { id: "google-translate", name: "Google Translate", url: "https://translate.google.com/" },
        { id: "deepl", name: "DeepL", url: "https://www.deepl.com/" },
      ],
    },
    {
      id: "metadata",
      name: "Metadata",
      children: [
        { id: "metagoofil", name: "Metagoofil (T)", url: "https://github.com/laramies/metagoofil", tool: true },
        { id: "foca", name: "FOCA (T)", url: "https://github.com/ElevenPaths/FOCA", tool: true },
      ],
    },
    {
      id: "mobile-emulation",
      name: "Mobile Emulation",
      children: [
        {
          id: "android-emulator",
          name: "Android Emulator (T)",
          url: "https://developer.android.com/studio/run/emulator",
          tool: true,
        },
        {
          id: "ios-simulator",
          name: "iOS Simulator (T)",
          url: "https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device",
          tool: true,
        },
      ],
    },
    {
      id: "terrorism",
      name: "Terrorism",
      children: [
        { id: "terrorism-research", name: "Terrorism Research", url: "https://www.terrorism-research.com/" },
        { id: "start-gtd", name: "START GTD", url: "https://www.start.umd.edu/gtd/" },
      ],
    },
    {
      id: "dark-web",
      name: "Dark Web",
      children: [
        { id: "tor-browser", name: "Tor Browser (T)", url: "https://www.torproject.org/", tool: true, darkweb: true },
        { id: "ahmia", name: "Ahmia", url: "https://ahmia.fi/", darkweb: true },
        { id: "torch", name: "Torch", url: "http://xmh57jrzrnw6insl.onion/", darkweb: true, manual: true },
      ],
    },
    {
      id: "digital-currency",
      name: "Digital Currency",
      children: [
        { id: "blockchain-explorer", name: "Blockchain Explorer", url: "https://www.blockchain.com/explorer" },
        { id: "etherscan", name: "Etherscan", url: "https://etherscan.io/" },
      ],
    },
    {
      id: "classifieds",
      name: "Classifieds",
      children: [
        { id: "craigslist", name: "Craigslist", url: "https://www.craigslist.org/" },
        { id: "ebay", name: "eBay", url: "https://www.ebay.com/" },
      ],
    },
    {
      id: "encoding-decoding",
      name: "Encoding / Decoding",
      children: [
        { id: "cyberchef", name: "CyberChef", url: "https://gchq.github.io/CyberChef/" },
        { id: "base64decode", name: "Base64 Decode", url: "https://www.base64decode.org/" },
      ],
    },
    {
      id: "tools",
      name: "Tools",
      children: [
        { id: "maltego", name: "Maltego (T)", url: "https://www.maltego.com/", tool: true },
        { id: "spiderfoot", name: "SpiderFoot (T)", url: "https://www.spiderfoot.net/", tool: true },
        { id: "recon-ng", name: "Recon-ng (T)", url: "https://github.com/lanmaster53/recon-ng", tool: true },
        {
          id: "osint-framework-tool",
          name: "OSINT Framework (T)",
          url: "https://github.com/lockfale/OSINT-Framework",
          tool: true,
        },
      ],
    },
    {
      id: "ai-tools",
      name: "AI Tools",
      children: [
        { id: "chatgpt", name: "ChatGPT", url: "https://chat.openai.com/", registration: true },
        { id: "bard", name: "Google Bard", url: "https://bard.google.com/", registration: true },
        { id: "claude", name: "Claude", url: "https://claude.ai/", registration: true },
        { id: "perplexity", name: "Perplexity AI", url: "https://www.perplexity.ai/", registration: true },
        { id: "huggingface", name: "Hugging Face", url: "https://huggingface.co/", registration: true },
        { id: "midjourney", name: "Midjourney", url: "https://www.midjourney.com/", registration: true },
        { id: "stable-diffusion", name: "Stable Diffusion", url: "https://stability.ai/", registration: true },
        { id: "dall-e", name: "DALL-E", url: "https://openai.com/dall-e-3", registration: true },
        { id: "llama", name: "Meta Llama", url: "https://ai.meta.com/llama/", registration: true },
        { id: "mistral", name: "Mistral AI", url: "https://mistral.ai/", registration: true },
        { id: "anthropic", name: "Anthropic", url: "https://www.anthropic.com/", registration: true },
        { id: "langchain", name: "LangChain", url: "https://www.langchain.com/", tool: true },
        { id: "llamaindex", name: "LlamaIndex", url: "https://www.llamaindex.ai/", tool: true },
      ],
    },
    {
      id: "malicious-file-analysis",
      name: "Malicious File Analysis",
      children: [
        { id: "virustotal", name: "VirusTotal", url: "https://www.virustotal.com/" },
        { id: "hybrid-analysis", name: "Hybrid Analysis", url: "https://www.hybrid-analysis.com/", registration: true },
        { id: "any-run", name: "ANY.RUN", url: "https://any.run/", registration: true },
      ],
    },
    {
      id: "exploits-advisories",
      name: "Exploits & Advisories",
      children: [
        { id: "exploit-db", name: "Exploit-DB", url: "https://www.exploit-db.com/" },
        { id: "cve", name: "CVE", url: "https://cve.mitre.org/" },
        { id: "nvd", name: "NVD", url: "https://nvd.nist.gov/" },
      ],
    },
    {
      id: "threat-intelligence",
      name: "Threat Intelligence",
      children: [
        { id: "misp", name: "MISP (T)", url: "https://www.misp-project.org/", tool: true },
        { id: "threatcrowd", name: "ThreatCrowd", url: "https://threatcrowd.org/" },
        { id: "alienvault-otx", name: "AlienVault OTX", url: "https://otx.alienvault.com/", registration: true },
      ],
    },
    {
      id: "opsec",
      name: "OpSec",
      children: [
        { id: "privacy-tools", name: "Privacy Tools", url: "https://www.privacytools.io/" },
        { id: "tails", name: "Tails (T)", url: "https://tails.boum.org/", tool: true },
      ],
    },
    {
      id: "documentation-evidence",
      name: "Documentation / Evidence Capture",
      children: [
        { id: "hunchly", name: "Hunchly (T)", url: "https://www.hunch.ly/", tool: true, registration: true },
        { id: "fireshot", name: "FireShot (T)", url: "https://getfireshot.com/", tool: true },
      ],
    },
    {
      id: "training",
      name: "Training",
      children: [
        {
          id: "sans-osint",
          name: "SANS OSINT",
          url: "https://www.sans.org/cyber-security-courses/open-source-intelligence-gathering/",
        },
        { id: "osint-combine", name: "OSINT Combine", url: "https://www.osintcombine.com/" },
        { id: "inteltechniques", name: "IntelTechniques", url: "https://inteltechniques.com/" },
      ],
    },
    // Nouvelles catégories
    {
      id: "ethical-hacking",
      name: "Ethical Hacking",
      children: [
        {
          id: "vulnerability-scanners",
          name: "Vulnerability Scanners",
          children: [
            { id: "nessus", name: "Nessus", url: "https://www.tenable.com/products/nessus", registration: true },
            { id: "openvas", name: "OpenVAS", url: "https://www.openvas.org/", tool: true },
            { id: "nikto", name: "Nikto (T)", url: "https://cirt.net/Nikto2", tool: true },
            { id: "acunetix", name: "Acunetix", url: "https://www.acunetix.com/", registration: true },
            { id: "burp-suite", name: "Burp Suite (T)", url: "https://portswigger.net/burp", tool: true },
            { id: "owasp-zap", name: "OWASP ZAP (T)", url: "https://www.zaproxy.org/", tool: true },
          ],
        },
        {
          id: "network-tools",
          name: "Network Tools",
          children: [
            { id: "nmap", name: "Nmap (T)", url: "https://nmap.org/", tool: true },
            { id: "wireshark", name: "Wireshark (T)", url: "https://www.wireshark.org/", tool: true },
            { id: "tcpdump", name: "tcpdump (T)", url: "https://www.tcpdump.org/", tool: true },
            { id: "netcat", name: "Netcat (T)", url: "http://netcat.sourceforge.net/", tool: true },
            { id: "masscan", name: "Masscan (T)", url: "https://github.com/robertdavidgraham/masscan", tool: true },
          ],
        },
        {
          id: "password-tools",
          name: "Password Tools",
          children: [
            { id: "hashcat", name: "Hashcat (T)", url: "https://hashcat.net/hashcat/", tool: true },
            { id: "john-the-ripper", name: "John the Ripper (T)", url: "https://www.openwall.com/john/", tool: true },
            { id: "hydra", name: "THC Hydra (T)", url: "https://github.com/vanhauser-thc/thc-hydra", tool: true },
            { id: "crackstation", name: "CrackStation", url: "https://crackstation.net/" },
          ],
        },
        {
          id: "exploitation-frameworks",
          name: "Exploitation Frameworks",
          children: [
            { id: "metasploit", name: "Metasploit (T)", url: "https://www.metasploit.com/", tool: true },
            { id: "beef", name: "BeEF (T)", url: "https://beefproject.com/", tool: true },
            { id: "sqlmap", name: "SQLmap (T)", url: "http://sqlmap.org/", tool: true },
            {
              id: "social-engineer-toolkit",
              name: "SET (T)",
              url: "https://github.com/trustedsec/social-engineer-toolkit",
              tool: true,
            },
          ],
        },
        {
          id: "osint-for-pentesters",
          name: "OSINT for Pentesters",
          children: [
            { id: "shodan-exploit", name: "Shodan Exploits", url: "https://exploits.shodan.io/" },
            { id: "censys-search", name: "Censys Search", url: "https://search.censys.io/", registration: true },
            { id: "crt-sh", name: "crt.sh", url: "https://crt.sh/" },
            { id: "dnsdumpster", name: "DNSdumpster", url: "https://dnsdumpster.com/" },
          ],
        },
      ],
    },
    {
      id: "development-tools",
      name: "Development Tools",
      children: [
        {
          id: "code-repositories",
          name: "Code Repositories",
          children: [
            { id: "github", name: "GitHub", url: "https://github.com/" },
            { id: "gitlab", name: "GitLab", url: "https://gitlab.com/" },
            { id: "bitbucket", name: "Bitbucket", url: "https://bitbucket.org/" },
            { id: "sourceforge", name: "SourceForge", url: "https://sourceforge.net/" },
          ],
        },
        {
          id: "ide-editors",
          name: "IDEs & Editors",
          children: [
            { id: "vscode", name: "Visual Studio Code (T)", url: "https://code.visualstudio.com/", tool: true },
            { id: "intellij", name: "IntelliJ IDEA (T)", url: "https://www.jetbrains.com/idea/", tool: true },
            { id: "sublime", name: "Sublime Text (T)", url: "https://www.sublimetext.com/", tool: true },
            { id: "vim", name: "Vim (T)", url: "https://www.vim.org/", tool: true },
            { id: "neovim", name: "Neovim (T)", url: "https://neovim.io/", tool: true },
          ],
        },
        {
          id: "api-tools",
          name: "API Tools",
          children: [
            { id: "postman", name: "Postman (T)", url: "https://www.postman.com/", tool: true },
            { id: "insomnia", name: "Insomnia (T)", url: "https://insomnia.rest/", tool: true },
            { id: "swagger", name: "Swagger", url: "https://swagger.io/" },
            { id: "hoppscotch", name: "Hoppscotch", url: "https://hoppscotch.io/" },
          ],
        },
        {
          id: "frontend-frameworks",
          name: "Frontend Frameworks",
          children: [
            { id: "react", name: "React", url: "https://reactjs.org/" },
            { id: "vue", name: "Vue.js", url: "https://vuejs.org/" },
            { id: "angular", name: "Angular", url: "https://angular.io/" },
            { id: "svelte", name: "Svelte", url: "https://svelte.dev/" },
            { id: "nextjs", name: "Next.js", url: "https://nextjs.org/" },
          ],
        },
        {
          id: "backend-frameworks",
          name: "Backend Frameworks",
          children: [
            { id: "nodejs", name: "Node.js", url: "https://nodejs.org/" },
            { id: "django", name: "Django", url: "https://www.djangoproject.com/" },
            { id: "flask", name: "Flask", url: "https://flask.palletsprojects.com/" },
            { id: "spring", name: "Spring", url: "https://spring.io/" },
            { id: "laravel", name: "Laravel", url: "https://laravel.com/" },
          ],
        },
        {
          id: "databases",
          name: "Databases",
          children: [
            { id: "postgresql", name: "PostgreSQL", url: "https://www.postgresql.org/" },
            { id: "mongodb", name: "MongoDB", url: "https://www.mongodb.com/" },
            { id: "mysql", name: "MySQL", url: "https://www.mysql.com/" },
            { id: "redis", name: "Redis", url: "https://redis.io/" },
            { id: "elasticsearch", name: "Elasticsearch", url: "https://www.elastic.co/" },
          ],
        },
        {
          id: "devops-tools",
          name: "DevOps Tools",
          children: [
            { id: "docker", name: "Docker (T)", url: "https://www.docker.com/", tool: true },
            { id: "kubernetes", name: "Kubernetes (T)", url: "https://kubernetes.io/", tool: true },
            { id: "jenkins", name: "Jenkins (T)", url: "https://www.jenkins.io/", tool: true },
            { id: "terraform", name: "Terraform (T)", url: "https://www.terraform.io/", tool: true },
            { id: "ansible", name: "Ansible (T)", url: "https://www.ansible.com/", tool: true },
          ],
        },
        {
          id: "cloud-platforms",
          name: "Cloud Platforms",
          children: [
            { id: "aws", name: "AWS", url: "https://aws.amazon.com/" },
            { id: "azure", name: "Azure", url: "https://azure.microsoft.com/" },
            { id: "gcp", name: "Google Cloud", url: "https://cloud.google.com/" },
            { id: "digitalocean", name: "DigitalOcean", url: "https://www.digitalocean.com/" },
            { id: "vercel", name: "Vercel", url: "https://vercel.com/" },
          ],
        },
      ],
    },
    {
      id: "ai-research",
      name: "AI Research",
      children: [
        {
          id: "ai-research-papers",
          name: "Research Papers",
          children: [
            { id: "arxiv-ai", name: "arXiv AI", url: "https://arxiv.org/list/cs.AI/recent" },
            { id: "paperswithcode", name: "Papers With Code", url: "https://paperswithcode.com/" },
            { id: "google-scholar", name: "Google Scholar", url: "https://scholar.google.com/" },
            { id: "semantic-scholar", name: "Semantic Scholar", url: "https://www.semanticscholar.org/" },
          ],
        },
        {
          id: "ai-models",
          name: "AI Models",
          children: [
            { id: "openai-models", name: "OpenAI Models", url: "https://platform.openai.com/docs/models" },
            { id: "huggingface-models", name: "Hugging Face Models", url: "https://huggingface.co/models" },
            { id: "tensorflow-hub", name: "TensorFlow Hub", url: "https://tfhub.dev/" },
            { id: "pytorch-hub", name: "PyTorch Hub", url: "https://pytorch.org/hub/" },
          ],
        },
        {
          id: "ai-datasets",
          name: "AI Datasets",
          children: [
            { id: "kaggle", name: "Kaggle", url: "https://www.kaggle.com/datasets" },
            { id: "huggingface-datasets", name: "Hugging Face Datasets", url: "https://huggingface.co/datasets" },
            { id: "tensorflow-datasets", name: "TensorFlow Datasets", url: "https://www.tensorflow.org/datasets" },
            { id: "uci-ml", name: "UCI ML Repository", url: "https://archive.ics.uci.edu/ml/index.php" },
          ],
        },
        {
          id: "ai-frameworks",
          name: "AI Frameworks",
          children: [
            { id: "tensorflow", name: "TensorFlow", url: "https://www.tensorflow.org/" },
            { id: "pytorch", name: "PyTorch", url: "https://pytorch.org/" },
            { id: "keras", name: "Keras", url: "https://keras.io/" },
            { id: "scikit-learn", name: "scikit-learn", url: "https://scikit-learn.org/" },
            { id: "jax", name: "JAX", url: "https://github.com/google/jax" },
          ],
        },
      ],
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity",
      children: [
        {
          id: "security-news",
          name: "Security News",
          children: [
            { id: "krebs", name: "Krebs on Security", url: "https://krebsonsecurity.com/" },
            { id: "threatpost", name: "Threatpost", url: "https://threatpost.com/" },
            { id: "bleepingcomputer", name: "BleepingComputer", url: "https://www.bleepingcomputer.com/" },
            { id: "darkreading", name: "Dark Reading", url: "https://www.darkreading.com/" },
          ],
        },
        {
          id: "security-tools",
          name: "Security Tools",
          children: [
            { id: "kali-linux", name: "Kali Linux (T)", url: "https://www.kali.org/", tool: true },
            { id: "parrot-os", name: "Parrot OS (T)", url: "https://parrotsec.org/", tool: true },
            { id: "snort", name: "Snort (T)", url: "https://www.snort.org/", tool: true },
            { id: "suricata", name: "Suricata (T)", url: "https://suricata-ids.org/", tool: true },
          ],
        },
        {
          id: "ctf-platforms",
          name: "CTF Platforms",
          children: [
            { id: "hackthebox", name: "HackTheBox", url: "https://www.hackthebox.eu/", registration: true },
            { id: "tryhackme", name: "TryHackMe", url: "https://tryhackme.com/", registration: true },
            { id: "vulnhub", name: "VulnHub", url: "https://www.vulnhub.com/" },
            { id: "picoctf", name: "PicoCTF", url: "https://picoctf.org/" },
          ],
        },
        {
          id: "bug-bounty",
          name: "Bug Bounty",
          children: [
            { id: "hackerone", name: "HackerOne", url: "https://www.hackerone.com/", registration: true },
            { id: "bugcrowd", name: "Bugcrowd", url: "https://www.bugcrowd.com/", registration: true },
            { id: "intigriti", name: "Intigriti", url: "https://www.intigriti.com/", registration: true },
            { id: "yeswehack", name: "YesWeHack", url: "https://www.yeswehack.com/", registration: true },
          ],
        },
      ],
    },
  ],
}

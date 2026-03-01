from urllib.parse import urlparse

trusted_domains = [
    "tcs.com",
    "infosys.com",
    "zoho.com",
    "accenture.com",
    "amazon.jobs"
]

def check_domain(link):
    domain = urlparse(link).netloc

    for d in trusted_domains:
        if d in domain:
            return True

    return False
import requests

url = "http://127.0.0.1:8000/media/sermons/pdfs/laodicee_Lht0mTf.pdf"
try:
    response = requests.head(url)
    print(f"Status: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    print(f"Content-Length: {response.headers.get('Content-Length')}")
except Exception as e:
    print(f"Error: {e}")

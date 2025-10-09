import requests

def get_repo_id(repo_url: str):
    parts = repo_url.rstrip("/").split("/")
    owner, repo = parts[-2], parts[-1]
    url = f"https://api.github.com/repos/{owner}/{repo}"
    r = requests.get(url)
    r.raise_for_status()
    data = r.json()
    return data["id"], data["full_name"], data["default_branch"]

def get_commit_sha(repo_full_name: str, branch: str):
    url = f"https://api.github.com/repos/{repo_full_name}/commits/{branch}"
    r = requests.get(url)
    r.raise_for_status()
    return r.json()["sha"]

def fetch_all_files(repo_full_name: str, path=""):
    url = f"https://api.github.com/repos/{repo_full_name}/contents/{path}"
    headers = {"Accept": "application/vnd.github.v3+json"}
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    data = r.json()
    files = []
    for f in data:
        if f["type"] == "file" and not f["name"].endswith((".png", ".jpg", ".jpeg", ".gif", ".mp4", ".zip", ".exe")):
            content = requests.get(f["download_url"]).text
            files.append({"path": f["path"], "content": content})
        elif f["type"] == "dir":
            files.extend(fetch_all_files(repo_full_name, f["path"]))
    return files

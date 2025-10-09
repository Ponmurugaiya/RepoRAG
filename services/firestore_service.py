from google.cloud import firestore
from config import FIRESTORE_CREDENTIALS

db = firestore.Client.from_service_account_json(FIRESTORE_CREDENTIALS)

def get_repo_doc(repo_id: int):
    return db.collection("repos").document(str(repo_id))

def update_repo_commit(repo_id: int, full_name: str, last_commit: str):
    db.collection("repos").document(str(repo_id)).set({
        "last_commit": last_commit,
        "full_name": full_name
    })

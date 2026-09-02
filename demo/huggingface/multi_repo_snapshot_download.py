from huggingface_hub import snapshot_download
from concurrent.futures import ThreadPoolExecutor, as_completed
import os

# 下载单个仓库
def download_repo(task):
    repo_id = task['repo_id']
    revision = task.get('revision', 'main')
    repo_type = task.get('repo_type', 'model')  # 可为 model、dataset、space
    local_dir = task['local_dir']

    try:
        os.makedirs(local_dir, exist_ok=True)

        path = snapshot_download(
            repo_id=repo_id,
            revision=revision,
            repo_type=repo_type,
            local_dir=local_dir,
        )

        print(f"✅ 下载成功: {repo_id} → {path}")
        return {"status": "success", "repo_id": repo_id, "path": path}

    except Exception as e:
        print(f"❌ 下载失败: {repo_id} → {e}")
        return {"status": "error", "repo_id": repo_id, "error": str(e)}

# 多线程并发下载
def download_multiple_repos(tasks, max_workers=4):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_task = {executor.submit(download_repo, task): task for task in tasks}
        for future in as_completed(future_to_task):
            results.append(future.result())
    return results

# 下载任务列表：每个任务设置自己的 local_dir
if __name__ == "__main__":
    download_tasks = [
        {
            "repo_id": "openai/gsm8k",
            "repo_type": "dataset",
            "revision": "main",
            "local_dir": "./openai/gsm8k"
        },
        {
            "repo_id": "tencent/Hunyuan-1.8B-Instruct",
            "repo_type": "model",
            "revision": "main",
            "local_dir": "./tencent/Hunyuan-1.8B-Instruct"
        },
        {
            "repo_id": "ds4sd/SmolDocling-256M-preview",
            "repo_type": "model",
            "revision": "main",
            "local_dir": "./ds4sd/SmolDocling-256M-preview"
        },
    ]

    download_multiple_repos(download_tasks, max_workers=3)


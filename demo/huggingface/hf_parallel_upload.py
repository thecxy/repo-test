from huggingface_hub import HfApi
from concurrent.futures import ThreadPoolExecutor, as_completed
import os

api = HfApi()

# 上传单个仓库
def upload_folder(task):
    repo_id = task['repo_id']
    repo_type = task.get('repo_type', 'model')  # model / dataset / space
    folder_path = task['folder_path']
    commit_message = task.get("commit_message", "Upload via script")

    try:
        # 如果文件夹不存在，跳过
        if not os.path.exists(folder_path):
            raise FileNotFoundError(f"文件夹不存在: {folder_path}")

        result = api.upload_folder(
            folder_path=folder_path,
            repo_id=repo_id,
            repo_type=repo_type,
            commit_message=commit_message,
            allow_patterns=task.get("allow_patterns"),  # 可选：仅上传特定文件
            ignore_patterns=task.get("ignore_patterns"),  # 可选：忽略特定文件
        )

        print(f"✅ 上传成功: {folder_path} → {repo_id}")
        return {"status": "success", "repo_id": repo_id, "folder": folder_path, "result": result}

    except Exception as e:
        print(f"❌ 上传失败: {folder_path} → {repo_id} → {e}")
        return {"status": "error", "repo_id": repo_id, "folder": folder_path, "error": str(e)}

# 多线程上传多个文件夹
def upload_multiple_folders(tasks, max_workers=4):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(upload_folder, task): task for task in tasks}
        for future in as_completed(futures):
            results.append(future.result())
    return results

# 示例上传任务
if __name__ == "__main__":
    upload_tasks = [
        {
            "repo_id": "openai/gsm8k",
            "repo_type": "dataset",
            "folder_path": "./openai/gsm8k/"
        },
        {
            "repo_id": "nvidia/canary-qwen-2.5b",
            "repo_type": "model",
            "folder_path": "./nvidia/canary-qwen-2.5b/"
        },
        {
            "repo_id": "Qwen/Qwen3-0.6B",
            "repo_type": "dataset",
            "folder_path": "./Qwen/Qwen3-0.6B/"
            
        }
    ]

    upload_multiple_folders(upload_tasks, max_workers=3)

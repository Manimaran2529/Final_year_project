def check_file(filename: str):
    suspicious_extensions = [".exe", ".bat", ".scr"]

    for ext in suspicious_extensions:
        if filename.endswith(ext):
            return "Dangerous file type detected"

    return None
import sqlite3

try:
    conn = sqlite3.connect('production_data.db')
    cursor = conn.cursor()
    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    for table in tables:
        print(table[0])
    conn.close()
except Exception as e:
    print("Error:", e)

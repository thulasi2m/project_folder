with open('server.py', 'r') as f:
    s = f.read()
s = s.replace('127.0.0.1', '0.0.0.0')
with open('server.py', 'w') as f:
    f.write(s)

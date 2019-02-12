import sys

def qiuyu(data):
    d = data.encode('utf-8')
    return (lambda b: b + (-len(b) % 16) * b'\0')(d)

def main():
    data = sys.argv[1]
    data = qiuyu(data)
    data = ''.join(map(chr, data))
    print(data)

if __name__ == '__main__':
    main()
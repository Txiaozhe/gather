import sys
import gzip
import zlib

def cryptAfter(h):
    c = zlib.crc32(h.encode('utf-8'))
    g = bytes([31, 139, 8, 0, 0, 0, 0, 0, 0, 0]) + gzip.compress((h + ',' + str(c)).encode('utf-8'))[10:]
    return g

def main():
    res = cryptAfter(sys.argv[1])
    res = "".join(map(chr, res))
    print(res)

if __name__ == '__main__':
    main()
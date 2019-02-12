import random

def uword(n):
    if n <= 0:
        return None
    elif n == 1:
        return '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[random.randint(0, 61)]
    else:
        return ''.join([uword(1) for i in range(n)])

def ubyte(n):
    if n > 0:
        return ubyte(n - 1) + hex(random.randint(0, 0xff))[2:].zfill(2)
    return ''

def uwifi():
    wifibssid = ':'.join([ubyte(i) for i in [1, 1, 1, 1, 1, 1]])
    i = None 
    del i
    wifiip = '192.168.' + str(random.randint(0, 255)) + '.' + str(random.randint(0, 255))
    wifimac = '02:00:00:00:00:00'
    wifissid = '"' + uword(random.randint(2, 8)) + '"'
    return locals()

def main():
    res = uwifi()
    print(res)

if __name__ == '__main__':
    main()
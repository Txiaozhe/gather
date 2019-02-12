package main

import (
	"bytes"
	"compress/gzip"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"io"
	"io/ioutil"
	"net"
	"os"
	"time"
)

// 数据包的类型
const (
	HEART_BEAT_PACKET = 0x00
	REPORT_PACKET     = 0x01
)

// InkDanmuServer 弹幕服务器地址
const InkDanmuServer = "60.205.82.107:80"

// 客户端对象
type TcpClient struct {
	connection *net.TCPConn
	hawkServer *net.TCPAddr
	stopChan   chan struct{}
}

func main() {
	// 拿到服务器地址信息
	hawkServer, err := net.ResolveTCPAddr("tcp", InkDanmuServer)
	if err != nil {
		fmt.Printf("hawk server [%s] resolve error: [%s]", InkDanmuServer, err.Error())
		os.Exit(1)
	}
	// 连接服务器
	connection, err := net.DialTCP("tcp", nil, hawkServer)
	if err != nil {
		fmt.Printf("connect to hawk server error: [%s]", err.Error())
		os.Exit(1)
	}

	sender(connection)

	client := &TcpClient{
		connection: connection,
		hawkServer: hawkServer,
		stopChan:   make(chan struct{}),
	}
	// 启动接收
	go client.receivePackets()

	// 发送心跳的goroutine
	go func() {
		heartBeatTick := time.Tick(2 * time.Second)
		for {
			select {
			case <-heartBeatTick:
				client.sendHeartPacket()
			case <-client.stopChan:
				return
			}
		}
	}()

	// 等待退出
	<-client.stopChan
}

func handleData(d []byte) {
	jsonStr, _ := GzipDecode(d)
	// fmt.Printf("payload length:%0x header %0x json %v \n", len(nBuff), buffer[:20], string(jsonStr))

	fmt.Println("json", string(jsonStr))
}

// 接收数据包
func (client *TcpClient) receivePackets() {
	defer close(client.stopChan)

	for {
		buffer := make([]byte, 2048)
		if _, err := io.ReadFull(client.connection, buffer[:20]); err != nil {
			fmt.Println("read header", err)
			return
		}

		length := binary.BigEndian.Uint16(buffer[18:20])

		if _, err := io.ReadFull(client.connection, buffer[20:20+length]); err != nil {
			fmt.Println("read header", err)
			return
		}

		handleData(buffer[20 : 20+length])
	}
}

// 发送数据包
func (client *TcpClient) sendReportPacket() {
	sender(client.connection)
}

// 发送心跳包，与发送数据包一样
func (client *TcpClient) sendHeartPacket() {
	sender(client.connection)
	fmt.Println("Send heartbeat data success!")
}

func sender(conn net.Conn) {
	uid := "1A156FBB"
	// topic := "topic_88"
	// rid := "1533799576408588"
	// uid := "29F04AC0"
	topic := "topic_49"
	rid := "1533872684082049"
	buffString := "090002034c04" + "0072" + uid + "000027100000002d"
	buff, _ := hex.DecodeString(buffString)

	var buffer bytes.Buffer
	buffer.Write(buff)
	fmt.Println(buffer)
	binary.Write(&buffer, binary.LittleEndian, uint16(1))
	fmt.Println(buffer)
	binary.Write(&buffer, binary.LittleEndian, uint16(0x600))
	fmt.Println(buffer)
	buffer.Write([]byte("domain"))
	fmt.Println(buffer)
	binary.Write(&buffer, binary.LittleEndian, uint16(0x500))
	fmt.Println(buffer)

	buffer.Write([]byte("group"))
	fmt.Println(buffer)
	binary.Write(&buffer, binary.LittleEndian, uint16(0x800))
	fmt.Println(buffer)
	buffer.Write([]byte(topic))
	fmt.Println(buffer)
	binary.Write(&buffer, binary.LittleEndian, uint16(0x1000))
	fmt.Println(buffer)
	buffer.Write([]byte(rid))
	fmt.Println(buffer)
	conn.Write(buffer.Bytes())
}

func GzipDecode(in []byte) (out []byte, err error) {
	reader, err := gzip.NewReader(bytes.NewReader(in))
	if err != nil {
		return nil, err
	}

	out, err = ioutil.ReadAll(reader)
	reader.Close()
	return
}

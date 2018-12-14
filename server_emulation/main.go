package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"encoding/json"
	//"encoding/xml"
	"io/ioutil"
)

type Sample struct {
	Vast_xml string
	Cpm int
	Width int
	Height int
}

func handler(w http.ResponseWriter, r *http.Request) {
	vast_raw, _ := ioutil.ReadFile(`./vast.xml`)
	sample := Sample{Vast_xml: string(vast_raw), Cpm: 1000, Width: 640, Height: 360}
	res, err := json.Marshal(&sample)
	w.Header().Set( "Access-Control-Allow-Origin", "http://localhost:9999" )
	w.Header().Set( "Access-Control-Allow-Credentials", "true" )
	w.Header().Set( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization" )
    w.Header().Set( "Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS" )
	w.Header().Set( "Content-Type", "application/json")
	//vast_xml, err := xml.Marshal(vast_raw)
	//w.Write(vast_raw)
	//w.Header().Set( "Content-Type", "application/json")
	//w.Write(res)
	w.Write(res)

	dump, err := httputil.DumpRequest(r, true)
	if err != nil {
		http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)
		return
	}
	fmt.Println(string(dump))
	//fmt.Fprintf(w, "<html><body>hello</body></html>\n")
	fmt.Println(res)
}

func main() {
	var httpServer http.Server
	http.HandleFunc("/", handler)
	log.Println("start http listening :18888")
	httpServer.Addr = ":18888"
	log.Println(httpServer.ListenAndServe())
}


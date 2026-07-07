# ByteTrace — Interactive Live Network Protocol Visualizer

**Participant Name:** Nitin Dwivedi  
**Team Name:** Samurai 
**GitHub Repository:** https://github.com/Nitin4381/ByteTrace  
**Demo Video:** https://github.com/Nitin4381/ByteTrace/raw/main/demo.mp4  

## 📌 Project Description
ByteTrace is an open-source educational network diagnostics engine and live protocol visualizer that traces every networking layer your computer uses — DNS, ICMP Ping, Traceroute, TCP Port Scanning, and HTTP/1.0 — built from scratch using 100% raw Python sockets with zero networking libraries.

Most network tools only show final results. ByteTrace shows the journey. It streams real-time, byte-level packet events over WebSockets to an interactive, animated React dashboard, letting developers and students step through internet routing step-by-step.

## 🛠️ Tech Stack
- **Backend Engine:** Python 3.11+ (Raw Sockets `AF_INET`, `SOCK_RAW`, `SOCK_DGRAM`, `SOCK_STREAM`), FastAPI, WebSockets, GeoIP API
- **Frontend Dashboard:** React 19, Framer Motion (micro-animations & interactive pipeline), Vanilla CSS
- **DevOps & Architecture:** Docker, Nginx, Docker Compose (supports both full containerization and hybrid Windows socket execution)

## 🚀 Key Features Built From Scratch
1. **Iterative DNS Resolver:** Traces the DNS hierarchy from Root Servers (.) ➡️ TLD Servers (.com) ➡️ Authoritative Nameservers manually using Python `struct`.
2. **Raw ICMP Ping:** Crafts ICMP Echo Request packets and calculates ones' complement checksums manually from byte arrays.
3. **TTL-based Traceroute:** Increments IP Time-To-Live (TTL) fields to discover hop-by-hop internet routing with real-time GeoIP city/country lookup.
4. **TCP Connect Port Scanner:** Performs full TCP 3-way handshakes across common services.
5. **Raw HTTP/1.0 Client:** Sends formatted GET request strings and parses status lines and headers manually from TCP socket streams.

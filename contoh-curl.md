# Text
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Jelaskan cara kerja AI dalam 1 kalimat"}'

# Image
curl -X POST http://localhost:3000/generate-from-image \
  -H "Content-Type: multipart/form-data" \
  -F "prompt=Jelaskan isi gambar ini dalam 1 kalimat" \
  -F "image=@./upload/gambar.jpg"

# Audio
curl -X POST http://localhost:3000/generate-from-audio \
  -H "Content-Type: multipart/form-data" \
  -F "prompt=Tolong transkrip audio ini dalam 1 kalimat" \
  -F "audio=@./upload/audio.mp3;type=audio/mpeg"


# Document
curl -X POST http://localhost:3000/generate-from-document \
  -H "Content-Type: multipart/form-data" \
  -F "prompt=Ringkas dokumen ini dalam 1 kalimat" \
  -F "document=@./upload/dokumen.pdf"

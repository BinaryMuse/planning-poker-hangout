#!/bin/bash
cat src/_xml_head.xml <(echo "<style>") src/style.css <(echo "</style>") src/body.html <(echo "<script>") src/app.js <(echo "</script>") src/_xml_foot.xml > pokerplanning.xml

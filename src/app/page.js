"use client";

import { useState } from "react";
import Image from "next/image";
import styles from './styles/style.module.css';


export default function Home() {
  const [threshold, setThreshold] = useState({ lower: 40, upper: 140 });
  const [isBlackBackground, setIsBlackBackground] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [highQ, setHighQ] = useState(false);



  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!uploadedFile) return alert("Please upload a file first!");
  
    setIsConverting(true);
    setResult(null); // optional: clear old result
  
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("lower_threshold", threshold.lower);
    formData.append("upper_threshold", threshold.upper);
    formData.append("is_black_background", isBlackBackground);
    formData.append("high_quality", highQ);

  
    try {
      const response = await fetch("https://photo-features.onrender.com/process/", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);
  
        setResult({
          type: response.headers.get("Content-Type"),
          url: fileUrl,
        });
      } else {
        console.error("Processing failed", await response.text());
      }
    } catch (error) {
      console.error("Error during processing:", error);
    } finally {
      setIsConverting(false);
    }
  };
  
  
  
  

  const handleDownload = () => {
    if (result) {
      const link = document.createElement("a");
      link.href = result.url;
      link.download = "processed_result"; 
      link.click();
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.tabela}>framefeatures</h1>
      <h1 className={styles.title}>upload the image or video for converting them into edge detected black & white version</h1>

      <div className={styles.controls}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className={styles.fileInput}
        />

        <div className={styles.sliderContainer}>
          <label>
            Lower Threshold:
            <input
              type="range"
              min="0"
              max="255"
              value={threshold.lower}
              onChange={(e) =>
                setThreshold({ ...threshold, lower: Number(e.target.value) })
              }
              className={styles.slider}
            />
          </label>
          <span>{threshold.lower}</span>
        </div>

        <div className={styles.sliderContainer}>
          <label>
            Upper Threshold:
            <input
              type="range"
              min="0"
              max="255"
              value={threshold.upper}
              onChange={(e) =>
                setThreshold({ ...threshold, upper: Number(e.target.value) })
              }
              className={styles.slider}
            />
          </label>
          <span>{threshold.upper}</span>
        </div>

        <div>
        <button
          onClick={() => setIsBlackBackground(!isBlackBackground)}
          style={{
            backgroundColor: !isBlackBackground ? "black" : "white",
            color: !isBlackBackground ? "white" : "black",
            padding: "10px 20px",
            border: "1px solid",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {!isBlackBackground ? "Black Background & White Features" : "White Background & Black Features"}
        </button>
        </div>
        <div>
        {"coversion type : "}
        <button
          onClick={() => setHighQ(!highQ)}
          style={{
            backgroundColor: "black",
            color: "whitesmoke",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          {highQ ? "high quality" : "normal"}
        </button>
        {highQ ? " high quality conversion takes longer time (up to few minutes)" : "normal conversion "}

        </div>

        <button onClick={handleConvert} className={styles.button}>
        {isConverting ? "Converting..." : "Convert"}
        </button>
       

      {result && (
        <div className={styles.resultSection}>
          <h2 className={styles.subtitle}>Result</h2>
          <div className={styles.resultPreview}>
            {result.type.startsWith("image/") ? (
              <img src={result.url} alt="Result Preview" className={styles.previewImage} />
            ) : (
              <video src={result.url} controls className={styles.previewVideo} />
            )}
          </div>
          <a href={result.url} download="processed_result">
            <button className={styles.button}>Download</button>
          </a>
        </div>
      )}
      </div>
      
    </div>
  );
}

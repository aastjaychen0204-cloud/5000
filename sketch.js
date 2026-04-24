let isGameOver = false;
let gameStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (isGameOver) {
    // 電擊效果：背景紅白閃爍
    background(frameCount % 10 < 5 ? 255 : 0, 0, 0);
    // 畫面震動效果
    translate(random(-5, 5), random(-5, 5));
  } else {
    background(0); // 正常黑色背景
  }

  let margin = 100; // 設定邊界距離，避免碰觸螢幕邊緣
  let pathWeight = 75; // 路徑寬度 (約 2 公分)
  stroke(255);   // 白色線條
  strokeWeight(pathWeight);
  noFill();
  strokeJoin(ROUND);

  beginShape();
  for (let x = margin; x <= width - margin; x += 10) {
    // 使用 noise 產生蜿蜒的曲線效果
    let y = height / 2 + map(noise(x * 0.005), 0, 1, -150, 150);
    vertex(x, y);
  }
  endShape();

  // 計算起點和終點的 Y 座標
  const yStart = height / 2 + map(noise(margin * 0.005), 0, 1, -150, 150);
  let yEnd = height / 2 + map(noise((width - margin) * 0.005), 0, 1, -150, 150);

  // 繪製起點標記
  // 如果滑鼠懸停在起點上，顏色變亮
  let startDist = dist(mouseX, mouseY, margin, yStart);
  if (!gameStarted && !isGameOver && startDist < 30) {
    fill(255, 100, 100);
    cursor(HAND);
  } else {
    fill(255, 0, 0);
    cursor(ARROW);
  }
  noStroke();
  circle(margin, yStart, 60); // 稍微加大按鈕感
  fill(255);
  textSize(32);
  textAlign(LEFT, BOTTOM);
  text(gameStarted ? "起點" : "點擊開始 CLICK START", margin, yStart - 50);

  // 繪製終點標記
  fill(255, 0, 0);
  circle(width - margin, yEnd, 40);
  textAlign(RIGHT, BOTTOM);
  text("終點 END", width - margin, yEnd - 50);

  if (!isGameOver && gameStarted) {
    // 取得當前滑鼠 X 位置對應的路徑中心 Y 座標
    let targetY = height / 2 + map(noise(mouseX * 0.005), 0, 1, -150, 150);
    
    // 圓環設定 (0.7 公分約 26 像素)
    let ringSize = 26;
    let ringRadius = ringSize / 2;
    
    // 碰撞偵測邏輯
    // 如果滑鼠超出了路徑範圍 (路徑寬度一半 - 圓環半徑) 或在路徑兩端外
    let distFromCenter = abs(mouseY - targetY);
    let threshold = (pathWeight / 2) - ringRadius;

    if (distFromCenter > threshold || mouseX < margin || mouseX > width - margin) {
      isGameOver = true;
    }

    // 繪製圓環
    stroke(0, 255, 255); // 青色圓環
    strokeWeight(3);
    circle(mouseX, mouseY, ringSize);
  } else if (!gameStarted && !isGameOver) {
    // 尚未開始時，繪製提示用的圓環
    stroke(255, 255, 255, 150);
    strokeWeight(2);
    circle(mouseX, mouseY, 26);
  } else {
    // 顯示失敗文字
    fill(255);
    noStroke();
    textSize(64);
    textAlign(CENTER, CENTER);
    text("遊戲失敗 GAME OVER", width / 2, height / 2);
    textSize(24);
    text("點擊滑鼠重新開始", width / 2, height / 2 + 80);
  }
}

function mousePressed() {
  if (isGameOver) {
    isGameOver = false;
    gameStarted = false;
  } else if (!gameStarted) {
    // 檢查是否點擊在起點按鈕範圍內
    let margin = 100;
    let yStart = height / 2 + map(noise(margin * 0.005), 0, 1, -150, 150);
    if (dist(mouseX, mouseY, margin, yStart) < 40) {
      gameStarted = true;
    }
  }
}

//오픈웨더
let APIkey = "96748635082c4a335a4c3e2e75abcb35";

//현재위치
let lat;
let lon;
function getLocation() {
  navigator.geolocation.getCurrentPosition(success);
}

getLocation();

//위도경도 현재 날씨, 3시간단위 예보
async function success(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;

  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=kr`;

  let weather = await fetch(weatherUrl);
  let forecast = await fetch(forecastUrl);

  let weatherData = await weather.json();
  let forecastData = await forecast.json();

  // console.log(weatherData, forecastData);
  renderText(weatherData);
  renderGraph(forecastData);
  renderMusic(weatherData);
}

//시티이름 현재 날씨, 3시간단위 예보
async function weather(cityname) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`;

  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIkey}&units=metric&lang=kr`;

  let weather = await fetch(weatherUrl);
  let forecast = await fetch(forecastUrl);

  let weatherData = await weather.json();
  let forecastData = await forecast.json();

  // console.log(weatherData, forecastData);

  renderText(weatherData);
  renderGraph(forecastData);
  renderMusic(weatherData);
}
//검색하면 시티이름날씨함수
let search = document.querySelector("#search");
let user = document.querySelector("#user");
search.addEventListener("click", async () => {
  if (user.value == "") {
    alert("검색어를 입력하세요");
  } else {
    let city = user.value;
    console.log(city);
    user.value = "";
    weather(city);
  }
});

user.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    if (user.value == "") {
      alert("검색어를 입력하세요");
    } else {
      let city = user.value;
      console.log(city);
      user.value = "";
      weather(city);
    }
  }
});

//렌더함수
let cityName = document.querySelector("#cityName");
let time = document.querySelector("#time");
let feels = document.querySelector("#feels");
let weatherText = document.querySelector("#weatherText");
let temp = document.querySelector("#temp");
let date;

//화면에 보이기(위:텍스트들)
function renderText(weatherData) {
  console.log(weatherData);
  date = new Date(weatherData.dt * 1000);
  cityName.textContent = `${weatherData.name}`;
  time.textContent = `${date.toLocaleString("ko-KR").slice(14, 22)}`;
  feels.textContent = `${Math.round(weatherData.main.feels_like)}º`;
  temp.textContent = `${Math.round(weatherData.main.temp)}º`;

  //weatherText
  let description = "";
  let feeling = "";

  if (weatherData.clouds.all > 80) {
    description = "하늘에 구름이 가득해요.";
  } else if (weatherData.clouds.all > 50) {
    description = "구름이 제법 많아서 흐린 하늘이에요.";
  } else {
    description = "구름이 없는 하늘이에요.";
  }

  if (
    weatherData.wind.speed > 4 &&
    weatherData.main.temp - weatherData.main.feels_like > 3
  ) {
    feeling = "바람이 많이 불어 실제 온도보다 춥게 느껴져요.";
  } else if (weatherData.main.temp > 30) {
    feeling = "가만히 있어도 땀이 나는 날씨에요.";
  } else if (weatherData.main.feels_like < 5) {
    feeling = "체감온도가 낮아서 추운 날씨에요. 옷을 따뜻하게 입어요.";
  } else {
    feeling = "온도가 적당해 활동하기 좋은 날씨예요.";
  }
  weatherText.innerHTML = `${description}<br> ${feeling}`;
}

//화면에 보이기(아래: 그래프)
function renderGraph(forecastData) {
  console.log(forecastData);

  //차트 만들 준비물
  let temps = []; //온도
  let labels = []; //시간

  //   console.log("temp갯수", tempEls.length);
  for (let i = 0; i < 7; i++) {
    //온도
    let tempData = Math.round(forecastData.list[i].main.temp);
    // console.log(tempData);
    temps.push(tempData);

    //시간 dt_txt 11~15자리 글자 가져오기
    let label = forecastData.list[i].dt_txt.slice(11, 16);
    labels.push(label);
  }

  drawChart(labels, temps);
}

//그래프만들기
let chart;

function drawChart(labels, temps) {
  console.log("차트를 그려보자");

  let ctx = document.querySelector("#weatherChart").getContext("2d");

  if (chart) {
    chart.destroy();
  } //만약 차트에 뭐가 있으면 차트를 없애라

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels, //x축(시간)
      datasets: [
        {
          label: "시간별 온도(℃)", //차트이름?
          data: temps, //y축(온도)
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          //   beginAtZero: true,
          min: 0,
          max: 20,
          ticks: {
            stepSize: 5,
          },
          title: {
            display: false,
            text: "온도(℃)",
            color: "",
            font: {
              size: 14,
            },
          },
        },
      },
    },
  });
}

//player
let player = document.querySelector(".playerWrap");
let playerLine = document.querySelector(".playerLine");
let line = document.querySelector(".playerLine .line");
let cd = document.querySelector(".player .cd");
let playInfo = document.querySelector(".playInfo");

// //클릭하면 애니메이션
// playerLine.addEventListener("click", () => {
//   line.classList.remove("ani");
//   line.offsetWidth;
//   line.classList.add("ani");
//   cd.classList.toggle("active");
// });

//플리정보박스
player.addEventListener("mouseenter", function () {
  if (cd.classList.contains("active")) {
    playInfo.style.display = "block";
  }
});
player.addEventListener("mouseleave", function () {
  playInfo.style.display = "none";
});

//city 버튼 클릭 클래스
let citybtns = document.querySelectorAll(".btnWrap button");
citybtns.forEach((citybtn) => {
  citybtn.addEventListener("click", () => {
    citybtns.forEach((citybtn) => {
      citybtn.classList.remove("on");
    });
    citybtn.classList.add("on");
  });
});

//날씨정보에 따라 디자인, 플리변경

// 1. 날씨별 데이터베이스 (색상 & 유튜브 링크)
const weatherDatabase = {
  // 01: 맑음
  "01": {
    color: "#34a4ffff",
    music: {
      comment: "산책하기 좋은날엔🌿 적당히 신나는 청량 플리",
      id: "fj8ReY0HxWc",
    },
  },
  // 02: 구름 조금
  "02": {
    color: "#0e587aff",
    music: {
      comment: "구름이 예쁜 어느 날, 무조건 나가서 듣는 맑고 청량한 플리! ☁️",
      id: "mL73nLwU4t4",
    },
  },
  // 03: 흐림
  "03": {
    color: "#055757ff",
    music: {
      comment:
        "[cafe playlist] 흐린날 망원동 카페에서 커피 한 잔 하는 감성 플리",
      id: "X13DNrfmvTI",
    },
  },
  // 04: 짙은 구름
  "04": {
    color: "#292e38ff",
    music: {
      comment: "[𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭] “흐린 날, 괜히 조용한 노래들” ☁️💿",
      id: "GcFw-rWPhOk",
    },
  },
  // 09: 소나기
  "09": {
    color: "#e0ffa6ff",
    music: {
      comment: "우리의 추억도 소나기처럼 내려와☂ ㅣ 비 오는 날 듣기 좋은 노래",
      id: "IZR5DJgjcnI",
    },
  },
  // 10: 비
  10: {
    color: "#d4a7f8ff",
    music: {
      comment: "히사이시 조의 비 오는 여름 작업실ㅣ🎥 𝟰𝗸 𝐩𝐥𝐚𝐲𝐥𝐢𝐬𝐭",
      id: "GzewUFCzpVg",
    },
  },
  // 11: 천둥번개
  11: {
    color: "#ff50f6ff",
    music: {
      comment: "[𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭] 하트시그널만의 폭우 속 감성 플리 ☔️",
      id: "_9kHNG7mcCI",
    },
  },
  // 13: 눈
  13: {
    color: "#cdf1ffff",
    music: {
      comment: "[Playlist] 눈이 내린다. 밤의 끝이 하얘졌다.",
      id: "=4Ei4dHzLiDE",
    },
  },
  // 50: 안개
  50: {
    color: "#f7f6bdff",
    music: {
      comment: "[Playlist] 안개 낀 숲 속의 공기",
      id: "a2es9iKEvqE",
    },
  },
};

let currentVideoId = ""; //

// 3. 메인 렌더링 함수 (UI 변경 & 재생 준비)
function renderMusic(weatherData) {
  // 1. 날씨 아이콘 분석
  const iconCode = weatherData.weather[0].icon;
  const codeNum = iconCode.substring(0, 2);
  const isNight = iconCode.includes("n");

  // 2. DB에서 데이터 찾기
  const data = weatherDatabase[codeNum] || weatherDatabase["01"];

  currentVideoId = data.music.id;

  // 4. 화면 텍스트 업데이트
  const playInfo = document.querySelector(".playInfo");
  const playInfoDesc = document.querySelector(".playInfo > div:last-child");

  // 설명: 유튜브 제목
  playInfoDesc.textContent = data.music.comment;

  playInfo.onclick = function () {
    window.open(`https://www.youtube.com/watch?v=${currentVideoId}`, "_blank");
  };

  // 5. CD 색상(디자인) 업데이트
  const themeColor = data.color;
  const cdElement = document.querySelector(".cd");

  if (isNight) {
    color = `linear-gradient(135deg, ${themeColor}, #15181fff 90%)`;
  } else {
    color = `linear-gradient(135deg, ${themeColor}, #dae7ffff 90%)`;
  }

  cdElement.style.background = color;

  document.querySelector(".innerCircle").style.backgroundColor = themeColor;

  // 6. 날씨가 바뀌면 재생 중이던 음악 끄고 초기화
  const hiddenPlayer = document.querySelector("#hiddenPlayer");
  if (hiddenPlayer) hiddenPlayer.innerHTML = "";
  cdElement.classList.remove("active");
  document.querySelector(".playerLine .line").classList.remove("ani");
}

// 4. 이벤트 리스너 (줄 당기기 -> 음악 재생/정지)
playerLine.addEventListener("click", () => {
  line.classList.remove("ani");
  line.offsetWidth;
  line.classList.add("ani");
  cd.classList.toggle("active");

  const hiddenPlayer = document.querySelector("#hiddenPlayer");
  // [상태 A] CD가 돌기 시작함 -> 음악 재생
  if (cd.classList.contains("active")) {
    if (currentVideoId) {
      // 보이지 않는 iframe 생성 (ID 활용)
      hiddenPlayer.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1&loop=1&playlist=${currentVideoId}" 
          allow="autoplay" 
          style="display:none">
        </iframe>`;
    }
  }
  // [상태 B] CD가 멈춤 -> 음악 끄기
  else {
    hiddenPlayer.innerHTML = "";
  }
});

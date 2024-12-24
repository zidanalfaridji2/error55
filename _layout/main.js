const { ucwords, removeBadWords, getFile } = require("../api/utils");
const { Sidebar, Shuffle } = require("./sidebar");
const NC = require("node-cache");
const Cache = new NC({ checkperiod: 0 });

const Main = async (config) => {
  if (config.typePage == "page") {
    return `
<main role="main" class="site-content">
    <div class="container">
        <div class="container pt-4 pb-4">
            <h1 class="font-weight-bold spanborder"><span>${config.titlePage}</span></h1>
            <div class="row">
                ${config.contents}
            </div>
        </div>
    </div>
</main>`;
  } else if (config.typePage == "homepage") {
    let adsTop = await getFile("ads/ads_top.txt");
    let adsCenter = await getFile("ads/ads_center.txt");
    let adsBot = await getFile("ads/ads_bottom.txt");
    let data = config.dataKw;
    let ds = "";
    let qw = [];
    let time = new Date().getTime();

    for (let i = 0; i < 27; i++) {
      if (data[i] != undefined) {
        time = time - 60000 * 10;
        Cache.set("time::" + data[i].toLowerCase(), time);
        qw.push(data[i]);
        if (i == 4) {
          ds += `<center>${adsCenter}</center>`;
        }
        ds += `
<div class="col-lg-4 col-sm-6 mb-5">
  <article class="text-center">
    <!-- Gambar Artikel -->
    <a href="/${data[i].replace(/\s+/g, ' ').replace(/\s/g, '-')}/">
      <img class="img-fluid mb-4" src="https://siswamaster.com/img/placeholder.svg" alt="${ucwords(data[i])}">
    </a>
    <!-- Kategori -->
    <p class="text-uppercase mb-2">Spruche</p>
    <!-- Judul Artikel -->
    <h4 class="title-border">
      <a class="text-dark" href="/${data[i].replace(/\s+/g, ' ').replace(/\s/g, '-')}/">
        ${ucwords(data[i])}
      </a>
    </h4>
    <!-- Deskripsi Artikel -->
  
    <!-- Tombol Baca Selengkapnya -->
  </article>
</div>
`;
      }
    }

    Cache.close();

    return `
<main role="main" class="site-content">
    <div class="container">
            <div class="row mt-3">
                <div class="row masonry-container">
                    <center>${adsTop}</center>
                    ${ds}
                    <center>${adsBot}</center>
                    <div class="container d-flex align-items-center justify-content-center">
                      <ul class="pagination">
                        <li id="prevPage" class="page-item"><a class="page-link" href="/page/${
                          config.prevPage
                        }">&laquo; Previous</a></li>
                        <li id="currentPage" class="page-item disabled"><span class="webjeda page-link">${
                          config.currentPage
                        }</span></li>
                        <li id="nextPage" class="page-item"><a class="page-link" href="/page/${
                          config.nextPage
                        }">Next &raquo;</a></li>
                      </ul>
                    </div>
                </div>
                ${await Sidebar(config)}
            </div>
    </div>
    <script>
    // Cek jika halaman adalah halaman utama
    if (window.location.pathname === '/') {
      // Hanya tampilkan tombol "Next" di halaman utama
      document.querySelector('#prevPage').style.visibility = 'hidden';
      document.querySelector('#currentPage').style.visibility = 'hidden';
      document.querySelector('#nextPage').style.visibility = 'visible';
    } else {
      // Di halaman lain, tampilkan semua tombol "Previous", "Current Page", dan "Next"
      document.querySelector('#prevPage').style.visibility = 'visible';
      document.querySelector('#currentPage').style.visibility = 'visible';
      document.querySelector('#nextPage').style.visibility = 'visible';
    }

      let img = document.querySelectorAll('img');
      let kw = \`${qw}\`;
      kw = kw.split(',');
      kw.forEach((e,i) => {
        e = e.replace(/\\s/g, '-');
        let http = new XMLHttpRequest();
        let url = '${config.baseUrl}/api/' + e;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function() {
          if(http.readyState == 4 && http.status == 200) {
            var data = http.responseText;
            img[i].setAttribute('src', data);
          }
        }
        http.send();
      });
    </script>
</main>

`;
  } 
else if (config.typePage == "post") {
  let adsTop = await getFile("ads/ads_top.txt");
  let adsCenter = await getFile("ads/ads_center.txt");
  let adsBot = await getFile("ads/ads_bottom.txt");
  let dataKw = Shuffle(config.kw); // Daftar kata kunci yang sudah diacak
  let dataTgl = {}; // Objek untuk menyimpan tanggal sesuai dengan kata kunci

  // Membaca file keywords.txt
  let listKw = await getFile("keywords.txt");
  listKw = listKw.split("\n");

  // Proses untuk memasukkan tanggal berdasarkan kata kunci
  listKw.forEach((e) => {
    const parts = e.split('#');
    if (parts.length === 2) {
      const keyword = parts[0].trim().toLowerCase(); // Normalisasi kata kunci
      const date = parts[1].trim();
      dataTgl[keyword] = date; // Menyimpan tanggal berdasarkan kata kunci
    }
  });

  let time = Cache.get("time::" + config.titlePage.toLowerCase());
  if (time == undefined) {
    time = new Date().getTime();
  }

  let tp = config.titlePage.toLowerCase();
  tp = tp.split(" ");
  let keyword = [];
  tp.forEach((e) => {
    if (e != "") {
      keyword.push(`"${e}"`);
    }
  });

  let content = "";
  let readNext = "";

  // Menambahkan elemen readNext dengan tanggal yang sesuai
  for (let i = 5; i < 11; i++) {
    let keyword = dataKw[i].toLowerCase(); // Menurunkan kapitalisasi untuk pencocokan
    let formattedDate = dataTgl[keyword] || "Tanggal Tidak Ditemukan"; // Ambil tanggal dari dataTgl atau tampilkan fallback


    // Menambahkan elemen readNext dengan tanggal yang sesuai
    readNext += `<div class="col-lg-6">
      <div class="mb-3 d-flex align-items-center">
          <a href="/${dataKw[i]
            .replace(/\s/g, "-")
            .toLowerCase()}/"><img id="readNext" width="80" height="80" src="https://siswamaster.com/img/placeholder.svg" onerror="this.onerror=null;this.src='https://siswamaster.com/img/placeholder.svg';" alt="${ucwords(dataKw[i])}" /></a>
          <div class="pl-3">
              <h2 class="mb-2 h6 font-weight-bold">
              <a class="text-dark" href="/${dataKw[i]
                .replace(/\s/g, "-")
                .toLowerCase()}/">${ucwords(dataKw[i])}</a>
              </h2>
              <small class="text-muted">${formattedDate}</small> <!-- Menampilkan tanggal yang sesuai -->
          </div>
      </div>
    </div>`;
  }


    let limiter = "";
    if (config.imageCount > 99) {
      limiter = 100;
    } else {
      limiter = config.imageCount;
    }
    for (let i = 1; i < limiter + 1; i++) {
      let img = config.img;
      let text = config.text;
      if (text[i] == "" || text[i] == undefined) {
        text[i] = img[i]["title"];
      }
      text[i] = await removeBadWords(text[i], config.removeBadWords);
      img[i]["title"] = await removeBadWords(
        img[i]["title"],
        config.removeBadWords
      );
      if (i == 4) {
        content += `<center>${adsCenter}</center>`;
content += `<p><span class="navi text-left"><a class="badge badge-warning" href="/${config.kw[0]
  .replace(/\s/g, "-")
  .toLowerCase()}/">${ucwords(config.kw[0])}</a></span>
<span class="navi text-left"><a class="badge badge-dark" href="/${config.kw[1]
  .replace(/\s/g, "-")
  .toLowerCase()}/">${ucwords(config.kw[1])}</a></span>
<span class="navi text-left"><a class="badge badge-success" href="/${config.kw[2]
  .replace(/\s/g, "-")
  .toLowerCase()}/">${ucwords(config.kw[2])}</a></span>
<span class="navi text-left"><a class="badge badge-danger" href="/${config.kw[3]
  .replace(/\s/g, "-")
  .toLowerCase()}/">${ucwords(config.kw[3])}</a></span></p>`;

      }
      content += `<p><img id="img" width="100%" src="https://siswamaster.com/img/placeholder.svg" data-src="${img[i]["image"]}" alt="${img[i]["title"]}" title="${img[i]["title"]}" onerror="this.onerror=null;this.src='${img[i]["thumbnail"]}';" class="center" loading="lazy" />${text[i]}</p>`;
    }

    
// Ambil tanggal berdasarkan titlePage
let pageTitle = config.titlePage.toLowerCase(); // Pastikan konsistensi case
let titleTime = null;

// Cek apakah ada keyword yang cocok dengan titlePage
for (let i = 0; i < config.kw.length; i++) {
  if (config.kw[i].toLowerCase() === pageTitle) {
    titleTime = config.tgl[i]; // Ambil tanggal yang sesuai index-nya
    break;
  }
}

// Gunakan tanggal default jika tidak ditemukan
let formattedTime = titleTime ? titleTime : new Date().toLocaleString();
    Cache.close();

    return `<main role="main" class="site-content">
    <div class="container">
    <div class="jumbotron jumbotron-fluid mb-3 pl-0 pt-0 pb-0 bg-white position-relative">
            <div class="h-100 tofront">
                <div class="row justify-content-between ">
                    <div class=" col-md-6 pr-0 pr-md-4 pt-4 pb-4 align-self-center">
                        <h1 class="display-4 mb-4 article-headline">${
                          config.titlePage
                        }</h1>
                        <div class="d-flex align-items-center">
                            <small class="ml-3">Written by ${
                              config.author
                            } <span class="text-muted d-block mt-1">${formattedTime}</span></small>
                        </div>
                    </div>
                    <div class="col-md-6 pr-0 align-self-center">
                        <img class="rounded" src="${
                          config.img[0]["image"]
                        }" onerror="this.onerror=null;this.src='${
      config.img[0]["thumbnail"]
    }';" alt="${config.titlePage}" loading="lazy" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-lg pt-4 pb-4">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-8">
                <article class="article-post">
                <center>${adsTop}</center>
                <p>${config.text[0]}</p>
                ${content}
                <center>${adsBot}</center>
                </article>
            </div>
        </div>
    </div>
    <div class="container">
    <div class="container pt-4 pb-4">
        <h5 class="font-weight-bold spanborder"><span>Read next</span></h5>
        <div class="row">
            ${readNext}
        </div>
        <script>
        var readImg = document.querySelectorAll('img[id="readNext"]');
        for(let i=0; i < 6; i++) {
          let query = readImg[i].getAttribute('alt');
          let e = query.replace(/\\s/g, '-').toLowerCase();
          let http = new XMLHttpRequest();
          let url = '${config.baseUrl}/api/' + e;
          http.open('POST', url, true);
          http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                var data = http.responseText;
                readImg[i].setAttribute('src', data);
              }
            }
            http.send();
        }
        </script>
    </div>
    </div>
</main>
<script type="application/ld+json">
{
    "@context": "http://schema.org",
    "@type": "BlogPosting",
    "articleSection": "post",
    "name": "${config.titlePage}",
    "headline": "${config.titlePage}",
    "alternativeHeadline": "${config.titlePage} - ${config.title}",
    "description": "${config.desc}",
    "isFamilyFriendly": "true",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${config.fullUrl}"
    },
    "author" : {
        "@type": "Person",
        "name": "${config.author}"
    },
    "creator" : {
        "@type": "Person",
        "name": "${config.author}"
    },
    "accountablePerson" : {
        "@type": "Person",
        "name": "${config.author}"
    },
    "copyrightHolder" : "${config.title}",
    "copyrightYear" : "${new Date(time).getFullYear()}",
    "dateCreated": "${new Date(formattedTime).toISOString()}",
    "datePublished": "${new Date(formattedTime).toISOString()}",
    "dateModified": "${new Date(formattedTime).toISOString()}",
    "publisher":{
        "@type":"Organization",
        "name": "${config.title}",
        "url": "${config.baseUrl}/",
        "logo": {
            "@type": "ImageObject",
            "url": "${config.favicon}",
            "width":"32",
            "height":"32"
        }
    },
    "image": "${config.image}",
    "url" : "${config.fullUrl}",
    "keywords" : [${keyword.join(",")},"${config.titlePage.toLowerCase()}"]
}
</script>
<script>function init(){var imgDefer=document.querySelectorAll('img[id="img"]');for (var i=0; i<imgDefer.length; i++){if(imgDefer[i].getAttribute('data-src')){imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));}}}window.onload=init;</script>`;
  }
};

module.exports = Main;

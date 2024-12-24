const { ucwords, getFile } = require("../api/utils");

const Shuffle = (arr) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const Sidebar = async (config) => {
  let adsTop = await getFile("ads/sidebar_top.txt");
  let adsBot = await getFile("ads/sidebar_bottom.txt");
  try {
    let data = config.kw;
    data = Shuffle(data);
    let time = new Date(Date.now());
    let ds = "";
    for (let i = 0; i < 5; i++) {
      let qw = data[i];
      ds += `<li class="mb-4"><span><h6 class="font-weight-bold"><a class="text-dark" href="/${qw
        .replace(/\s+/g, " ")
        .replace(/\s/g, "-")}/">${ucwords(
        qw
      )}</a></h6><span class="d-block text-muted"><span class="text-capitalize text-muted smoothscroll">${time.toLocaleDateString()}</span></span></span></li>\n`;
    }

    let results = `

`;
    return results;
  } catch (e) {}
};

module.exports = { Sidebar, Shuffle };

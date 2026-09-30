const clickBtn = document.querySelector(".btn");
const emojiName = document.querySelector(".emoji-name");

clickBtn.addEventListener("click", handleDisplayEmoji);

function random(len) {
  return Math.floor(Math.random() * (len * 10));
}

const getEmoji = async () => {
  try {
    const apiKey = "dfbe030cde11452fbf51f083a9aafb4ff3bada68";
    const apiURL = `https://emoji-api.com/emojis?access_key=${apiKey}`;

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Custom err failed to fetch!");

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Catch triggered", error);
  }
};

async function setEmoji() {
  const apiEmoji = await getEmoji();
  const finalArr = new Array();
  const emojiCat = new Array();

  for (let i = 0; i < 15; i++) {
    emojiCat.push(i * 100);
  }

  const rand = random(emojiCat.length);

  // //I prefer nested loop but below example with map() + flat()
  for (let i = 0; i < emojiCat.length; i++) {
    let temp = emojiCat[i];
    for (let j = 0; j < 20; j++) {
      finalArr.push(apiEmoji[temp]);
      temp++;
    }
  }

  return {
    rand,
    finalArr,
  };

  // // example with map()
  // finalArr = emojiCat.map(index => {
  //     let tempArr = [];
  //     for (let j = 0; j < 10; j++) {
  //         tempArr.push(apiEmoji[index + j]);
  //     }
  //     return tempArr;
  // }).flat();

  // console.log(rand, finalArr[rand]);
}

async function handleDisplayEmoji() {
  try {
    const { rand, finalArr } = await setEmoji();

    // console.log(rand, finalArr);

    clickBtn.innerHTML = finalArr[rand].character;
    emojiName.innerHTML = finalArr[rand].unicodeName
      .split(" ")
      .splice(1)
      .join(" ");

    if (!document.querySelector(".emoji-copy")) {
      const emojiSpan = document.createElement("span");
      const container = document.querySelector(".container");
      emojiSpan.className = "emoji-copy";
      emojiSpan.textContent = "copy📝";
      container.appendChild(emojiSpan);
      emojiSpan.addEventListener("click", handleCopyEmoji);
    }
  } catch (error) {
    console.error("Custom err failed func displayEmoji()", error);
  }
}

async function handleCopyEmoji() {
  try {
    const currentSelectedEmoji = document.querySelector(".btn").innerText;
    const copyBtn = document.querySelector(".emoji-copy");
    await navigator.clipboard.writeText(currentSelectedEmoji);
    copyBtn.innerText = "Copied! ✅";
    setTimeout(() => {
      copyBtn.innerText = "copy📝";
    }, 500);
  } catch (error) {
    console.error("Failed to copy: ", error);
  }
}

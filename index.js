document.addEventListener("DOMContentLoaded", function () {

  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");

  const statsContainer = document.querySelector(".stats-container");

  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");

  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById('hard-label');

  const cardStatsContainer = document.querySelector(".stats-cards");
  

  

  // return true or false based on a regex
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]+$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const url =`https://leetcode-stats-api.herokuapp.com/${username}`;

    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      let response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to fetch the User details");
      }

      const data = await response.json();
      console.log("Logging data:", data);
      displayUserData(data);
    }

    catch (error) {
      statsContainer.innerHTML = `<p> No data found!</p>`
    } 
    finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle){
    const progressDegree = (solved/total)*360;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent =`${solved}/${total}`;
  }



  function displayUserData(data){
    // Total Questions
    const totalQuestions = data.totalQuestions;
    const totalEasyQues =data.totalEasy;
    const totalMediumQues =data.totalMedium;
    const totalHardQues =data.totalHard;

    // Solved Question
    const totalSolved = data.totalSolved;
    const easySolved = data.easySolved;
    const mediumSolved = data.mediumSolved;
    const hardSolved = data.hardSolved;

    // updateProgress(totalSolved,totalQuestions,totalLabel,totalProgressCircle)
    updateProgress(easySolved, totalEasyQues, easyLabel,
      easyProgressCircle)
    updateProgress(mediumSolved, totalMediumQues, mediumLabel, 
      mediumProgressCircle)
    updateProgress(hardSolved, totalHardQues, hardLabel, 
      hardProgressCircle)


      const cardsData =[
        {label: "Total Submissions", value: totalSolved},
        {label: "Easy Submissions", value: easySolved},
        {label: "Medium Submissions", value: mediumSolved},
        {label: "Hard Submissions", value: hardSolved},
    ];

      console.log("card ka data" , cardsData);


      cardStatsContainer.innerHTML = cardsData.map(
        data => 
          `<div class ="card">
          <h4>${data.label}</h4>
          <p>${data.value}</p>
          </div>`
      ).join("")
  }



  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("logging username:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    } 
  });
});

document.addEventListener("DOMContentLoaded", function(){
    
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");

    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCirlce = document.querySelector(".easy-progress");
    const mediumProgressCirlce = document.querySelector(".medium-progress");
    const hardProgressCirlce = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");


    function validateUsername(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9]+$/;

        const isMatching = regex.test(username);
        
        if(!isMatching){
            alert("Invalid Username");
        }
        
        return isMatching;
    }


    async function fetchUserDetails(username){

        
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try{

            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            
            let response = await fetch(url);
            
            // const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

            // const targetUrl = 'https://leetcode.com/graphql/';
            // const myHeaders = new Headers();
            // myHeaders.append("content-type", "application/json");

            // const graphql = JSON.stringify({
            //     query: "\n query userSessionProgress($username: String!) {\n allQuestionsCount {\n difficulty\n   count\n }\n matchedUser{username: $username} {\n submitStats {\n acSubmissionNum {\n totalSubmissionNum {\n difficulty\n  count\n   submissions\n   }\n  }\n  \n}\n   ",
            //     variables: { "username":`${username}` }
            // })

            // const requestOptions = {
            //     method: "POST",
            //     headers: myHeaders,
            //     body: graphql,
            //     redirect: "follow"
            // };

            // const url = proxyUrl+targetUrl;

            // const response = await fetch(proxyUrl+targetUrl, requestOptions);


            if(!response.ok){
                throw new Error("Unable to fetch the user details")
            }

            const data = await response.json();

            console.log("Loggind data", data);
            
            displayUserData(data);
        }
        catch(error){
            statsContainer.innerHTML = `<p>No data found!</p>`
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false; 
        }
    }


    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`
    }

    function displayUserData(data){
        const totalQuestions = data.totalQuestions;
        const totalEasyQues = data.totalEasy;
        const totalMediumQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;
        
        const solvedTotalQues = data.totalSolved;
        
        updateProgress(easySolved, totalEasyQues, easyLabel, easyProgressCirlce);
        updateProgress(mediumSolved, totalMediumQues, mediumLabel,mediumProgressCirlce);
        updateProgress(hardSolved, totalHardQues, hardLabel, hardProgressCirlce);

        const cardsData = [
            {label: "Total Submissions", value: solvedTotalQues},
            {label: "Easy Submissions", value: easySolved},
            {label: "Medium Submissions", value: mediumSolved},
            {label: "Hard Submissions", value: hardSolved},
        ];

        cardStatsContainer.innerHTML = cardsData.map(
            data => 
                `<div class="card">
                    <h4>${data.label}</h4> 
                    <p>${data.value}</p>
                </div>`
        ).join("")
    }

    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log("logging username:", username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
        
    })


})
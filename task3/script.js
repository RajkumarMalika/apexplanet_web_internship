let currentQuestion = 0;
    let score = 0;
    const questions = [
      { question: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" },
      { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter"], answer: "Mars" }
    ];

    function displayQuestion() {
      if (currentQuestion >= questions.length) {
        document.getElementById("question").innerText = `Quiz finished! Your score: ${score}/${questions.length}`;
        document.getElementById("options").innerHTML = "";
        return;
      }
      const q = questions[currentQuestion];
      document.getElementById("question").innerText = q.question;
      document.getElementById("options").innerHTML = q.options.map(opt => `<button onclick="checkAnswer('${opt}')">${opt}</button>`).join("");
    }

    function checkAnswer(selected) {
      if (selected === questions[currentQuestion].answer) score++;
      currentQuestion++;
      displayQuestion();
    }

    function nextQuestion() {
      // This will trigger checkAnswer if a button is clicked
      // Placeholder for manual next button logic if needed
    }

    // Fetch data from API
    fetch('https://api.chucknorris.io/jokes/random')
      .then(response => response.json())
      .then(data => {
        document.getElementById('apiOutput').innerText = data.value;
      })
      .catch(error => {
        document.getElementById('apiOutput').innerText = "Failed to load joke.";
        console.error('Error:', error);
      });

    // Start the quiz
    displayQuestion();
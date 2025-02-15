
(() => {

	// include question array object;
	let questions = jsq_questions;

	let question_index = 0;
	let score = 0;
	let time_left = 30;
	let timer_fun = '';
	let current_question_completed = false;

	const next_button = document.getElementById("next_question");
	const start_button = document.getElementById("jsq_start");

	const replaceHTMLtags = text => text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	const stopTimer = () => {
		clearInterval(timer_fun);
		document.getElementById("jsq_timer").innerHTML = '0';
	};

	const startTimer = (time_value) => {
		timer_fun = setInterval(() => {
			if (time_value <= 0) {
				stopTimer();
				optionSelected();
			}
			document.getElementById("jsq_timer").innerHTML = time_value;
			time_value -= 1;

		}, 1000);
	};

	// get all options radio
	const getAllOptions = () => document.querySelectorAll("input[name=jsq_option]");

	// after selected option disable radio 
	const disableOptions = () => {
		let option_radios = getAllOptions();
		option_radios.forEach(element => {
			element.disabled = true;
			element.nextElementSibling.classList.add("disabled");
		});
	};


	// evaluate the user selected option answer
	const optionSelected = () => {
		let score_set = '0';
		let status = 'time out';
		let answer = questions[question_index].answer;
		let options_radios = getAllOptions();
		options_radios.forEach(element => {

			// correct answer [color green]
			if (element.value == answer) {
				element.nextElementSibling.classList.add("jsq-correct");
			}

			// user selected incorrect answer [color red]. 
			if (element.checked && element.value != answer) {
				element.nextElementSibling.classList.add("jsq-incorrect", "jsq_shake");

				// set user selected option. after preview all answers list
				questions[question_index].user_selected = element.value;
				score_set = 0;

				status = 'incorrect answer';
			}

			// user selected answer correct
			if (element.checked && element.value == answer) {
				score++;
				score_set = 1;

				status = 'correct answer';
			}

		});
		// set question answer status
		questions[question_index].status = status;
		// set score
		questions[question_index].score = score_set;
		// set current question completed
		questions[question_index].completed = true;

		current_question_completed = true;

		disableOptions();
		stopTimer();
		next_button.style.visibility = 'visible';
	};

	// show next question and options
	const showQuestion = () => {
		let current_question = questions[question_index];
		let options_div = '';
		let options = current_question.options;
		let id_number = 0;
		let option_id = ['A', 'B', 'C', 'D'];

		for (let key in options) {
			options_div += '<div class="jsq_anm" style="--jsq_at:' + (id_number + 1) + '">' +
				'<input type="radio" name="jsq_option" id="option_' + id_number + '" value="' + key + '">' +
				'<label for="option_' + id_number + '"><span>' + option_id[id_number] + '</span><span>' + replaceHTMLtags(options[key]) + '</span></label>' +
				'</div>';
			id_number++;
		}

		document.getElementById("jsq_question").innerText = current_question.question;
		document.getElementById("jsq_options").innerHTML = options_div;
		document.getElementById("jsq_total").innerText = '' + (question_index + 1) + ' of  ' + questions.length + ' Questions';
		showCodeBox(current_question);
		let option_radios = getAllOptions();
		option_radios.forEach(element => {
			element.addEventListener("change", optionSelected);
		});
		startTimer(time_left);
		current_question_completed = false;
	};

	// show all question answers
	const showAllAnswers = () => {
		let div = '';
		for (let i = 0; i < questions.length; i++) {
			let question_list = questions[i];
			let options = question_list.options;
			div += '<div class="jsq_answer_block">';
			div += '<div class="jsq_fnsh_question">' + (i + 1) + ', ' + replaceHTMLtags(question_list.question) + '</div>';
			div += '<div class="jsq_fnsh_options">';
			for (let key in options) {

				if (question_list.answer == key) {
					div += '<span style="color: green;font-weight: bold;">' + replaceHTMLtags(options[key]) + '</span>';
				} else if (question_list.user_selected == key) {
					div += '<span style="color: red;font-weight: bold;">' + replaceHTMLtags(options[key]) + '</span>';
				} else {
					div += '<span>' + replaceHTMLtags(options[key]) + '</span>';
				}
			}
			div += '</div>';
			div += '<div class="jsq_q_status">status : ' + question_list.status + '</div>';
			div += '<div class="jsq_fnsh_score">score : ' + question_list.score + '</div>';
			div += '</div>';
		}

		document.getElementById("jsq_all_answers").innerHTML = div;
		document.getElementById("all_answer_btn").remove();
	};

	// If there is coding in this question, it will appear in this code box. show hide box
	const showCodeBox = (current_question) => {
		let code_box = document.getElementById("jsq_code_box");
		let pre_code = document.querySelector("#jsq_code_box code");

		if (current_question.code == undefined) {
			code_box.style.display = 'none';
			pre_code.innerText = '';
		}else{
			code_box.style.display = 'block';
			pre_code.innerText = current_question.code;
		}
		// highlight code 
		pre_code.innerHTML = Prism.highlight(pre_code.innerText, Prism.languages.javascript, 'javascript');
	};
	// question completed show result
	const completedQuiz = () => {
    let div = '<div class="jsq_finish_box">';
    div += '<div class="jsq_finish">You have completed the Quiz!</div>';
    div += '<br>';
    div += '<div class="jsq_score">Your score: <b>' + score + ' out of ' + questions.length + '</b> <b>' + Math.round((100 * score) / questions.length) + '%</b></div>';
    div += ' <button class="jsq_btn" id="all_answer_btn">Check your answers</button>';
    div += ' <button class="jsq_btn" id="restart_quiz_btn">Restart Quiz</button>'; // नया बटन
    div += '<div id="jsq_all_answers"></div>';
    div += '</div>';

    document.getElementById("jsq_box").innerHTML = div;

    // Check answers event
    document.getElementById("all_answer_btn").addEventListener("click", showAllAnswers);

    // **Restart Quiz Button Event**
    document.getElementById("restart_quiz_btn").addEventListener("click", () => {
        location.reload(); // पेज को रीलोड करके क्विज़ रीस्टार्ट करें
    });
};



	// go next question
	const nextQuestion = () => {
		// if option not selected
		if (!current_question_completed) {
			return;
		}

		question_index++;
		if (questions.length - 1 < question_index) {
			stopTimer();
			completedQuiz();
			return;
		}

		next_button.style.visibility = 'hidden';

		if (questions[question_index].completed) {
			next_button.style.visibility = 'visible';
		}

			showQuestion();
	};


	// start quiz
	const startQuiz = () => {
		document.querySelector(".jsq_header").removeAttribute("style");
		document.querySelector(".jsq_main_content").removeAttribute("style");
		document.querySelector(".jsq_footer").removeAttribute("style");
		document.querySelector("#jsq_ifo_box").remove();
		showQuestion();
	};

	next_button.addEventListener("click", nextQuestion);
	start_button.addEventListener("click", startQuiz);
	// code generated by https://www.html-code-generator.com/javascript/quiz-generator

})();




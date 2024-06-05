document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const dataForm = document.getElementById('data-form');
    const dataList = document.getElementById('data-list');
    const progressChartCtx = document.getElementById('progress-chart').getContext('2d');

    // カレンダーを生成
    const generateCalendar = () => {
        const mealPlan = [
            "鶏胸肉のグリル、野菜炒め、玄米ご飯, 1300 kcal",
            "魚の煮付け、ほうれん草のおひたし、玄米ご飯, 1200 kcal",
            "豚ヒレ肉の生姜焼き、ブロッコリーサラダ、玄米ご飯, 1400 kcal",
            "鶏胸肉の蒸し料理、野菜スティック、玄米ご飯, 1200 kcal",
            "豚肉とキノコの炒め物、ほうれん草と豆腐の和え物、玄米ご飯, 1300 kcal",
            "鶏胸肉の照り焼き、もやし炒め、玄米ご飯, 1400 kcal",
            "牛肉と野菜の炒め物、大根サラダ、玄米ご飯, 1300 kcal"
        ];
        const workoutPlan = [
            "プッシュアップ：4セット×15回、シットアップ：4セット×20回、スクワット：4セット×20回",
            "バーピージャンプ：3セット×10回、ランジ：3セット×15回（各脚）、プランク：3セット×1分",
            "休息",
            "プッシュアップ：4セット×15回、シットアップ：4セット×20回、スクワット：4セット×20回",
            "バーピージャンプ：3セット×10回、ランジ：3セット×15回（各脚）、プランク：3セット×1分",
            "プッシュアップ：4セット×15回、シットアップ：4セット×20回、スクワット：4セット×20回",
            "休息"
        ];
        
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const meal = mealPlan[dayOfWeek];
            const workout = workoutPlan[dayOfWeek];

            const dayElement = document.createElement('div');
            dayElement.innerHTML = `<strong>${day}</strong><br>食事: ${meal}<br>運動: ${workout}`;
            calendarElement.appendChild(dayElement);
        }
    };

    // フォームデータの処理
    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(dataForm);
        const date = formData.get('date');
        const weight = parseFloat(formData.get('weight'));
        const bodyFat = parseFloat(formData.get('body-fat'));

        const listItem = document.createElement('li');
        listItem.textContent = `${date}: 体重 ${weight} kg, 体脂肪率 ${bodyFat} %`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            dataList.removeChild(listItem);
        });
        listItem.appendChild(deleteButton);
        dataList.appendChild(listItem);

        // チャートの更新
        updateChart(date, weight, bodyFat);

        dataForm.reset();
    });

    // チャートの設定
    let progressChart = new Chart(progressChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '体重 (kg)',
                    borderColor: 'blue',
                    fill: false,
                    data: []
                },
                {
                    label: '体脂肪率 (%)',
                    borderColor: 'green',
                    fill: false,
                    data: []
                }
            ]
        },
       
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: '日付'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '数値'
                        }
                    }
                }
            }
        });
    };

    // チャートの更新
    const updateChart = (date, weight, bodyFat) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        progressChart.data.labels.push(formattedDate);
        progressChart.data.datasets[0].data.push({ x: formattedDate, y: weight });
        progressChart.data.datasets[1].data.push({ x: formattedDate, y: bodyFat });
        progressChart.update();
    };

    // 等比数列の計画データをチャートに追加
    const addPlanDataToChart = () => {
        const initialWeight = 76;
        const targetWeight = 64;
        const initialBodyFat = 24;
        const targetBodyFat = 17;
        const days = 60;
        const weightRatio = (targetWeight / initialWeight) ** (1 / (days - 1));
        const bodyFatRatio = (targetBodyFat / initialBodyFat) ** (1 / (days - 1));

        const today = new Date();
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const formattedDate = date.toISOString().split('T')[0];
            const weight = initialWeight * (weightRatio ** i);
            const bodyFat = initialBodyFat * (bodyFatRatio ** i);

            progressChart.data.labels.push(formattedDate);
            progressChart.data.datasets[0].data.push({ x: formattedDate, y: weight });
            progressChart.data.datasets[1].data.push({ x: formattedDate, y: bodyFat });
        }
        progressChart.update();
    };

    generateCalendar();
    addPlanDataToChart();
});

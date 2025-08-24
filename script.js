
document.addEventListener('DOMContentLoaded', function() {
    const drawButton = document.getElementById('drawButton');
    const resetButton = document.getElementById('resetButton');
    const resultContainer = document.getElementById('result');
    const numbersDisplay = document.getElementById('numbers');
    
    let isDrawing = false;
    
    // 초기 환영 메시지
    Swal.fire({
        title: '🧹 청소당번 뽑기에 오신 것을 환영합니다!',
        text: '공정하고 랜덤한 선택으로 청소당번을 정해보세요.',
        icon: 'info',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        confirmButtonColor: '#28a745',
        confirmButtonText: '시작하기',
        timer: 3000,
        timerProgressBar: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
    
    drawButton.addEventListener('click', function() {
        if (isDrawing) return;
        
        // 뽑기 시작 확인
        Swal.fire({
            title: '청소당번을 뽑으시겠습니까?',
            text: '1번부터 25번 중 5명이 선택됩니다.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '네, 뽑겠습니다!',
            cancelButtonText: '취소',
            background: 'rgba(255, 255, 255, 0.95)',
            backdrop: 'rgba(0, 0, 0, 0.7)'
        }).then((result) => {
            if (result.isConfirmed) {
                drawNumbers();
            }
        });
    });
    
    resetButton.addEventListener('click', function() {
        Swal.fire({
            title: '다시 뽑으시겠습니까?',
            text: '현재 결과가 사라지고 새로 뽑게 됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#17a2b8',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '네, 다시 뽑겠습니다',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                resetApp();
                Swal.fire({
                    title: '초기화 완료!',
                    text: '새로운 뽑기를 시작할 수 있습니다.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });
    
    function drawNumbers() {
        isDrawing = true;
        drawButton.disabled = true;
        
        // 버튼 상태 변경
        drawButton.innerHTML = '<span class="loading-spinner me-2"></span>뽑는 중...';
        drawButton.classList.add('disabled');
        
        // 결과 컨테이너 숨기기
        resultContainer.classList.remove('show');
        
        // 로딩 알림
        Swal.fire({
            title: '당번을 뽑고 있습니다...',
            html: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            timer: 2000,
            timerProgressBar: true
        });
        
        setTimeout(() => {
            // 1부터 25까지의 숫자 중 랜덤으로 5개 선택
            const selectedNumbers = getRandomNumbers(1, 25, 5);
            selectedNumbers.sort((a, b) => a - b); // 오름차순 정렬
            
            Swal.close();
            
            // 결과 표시
            displayNumbers(selectedNumbers);
            
            // UI 업데이트
            drawButton.style.display = 'none';
            resetButton.style.display = 'inline-block';
            resultContainer.classList.add('show');
            
            // 성공 알림
            setTimeout(() => {
                Swal.fire({
                    title: '🎉 당번 선택 완료!',
                    html: `선택된 번호: <strong>${selectedNumbers.join(', ')}</strong>번`,
                    icon: 'success',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: '확인',
                    showClass: {
                        popup: 'animate__animated animate__bounceIn'
                    }
                });
            }, 1500);
            
            isDrawing = false;
        }, 2000);
    }
    
    function getRandomNumbers(min, max, count) {
        const numbers = [];
        const availableNumbers = [];
        
        // 사용 가능한 모든 번호 생성
        for (let i = min; i <= max; i++) {
            availableNumbers.push(i);
        }
        
        // 랜덤으로 선택
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            numbers.push(availableNumbers[randomIndex]);
            availableNumbers.splice(randomIndex, 1); // 선택된 번호 제거
        }
        
        return numbers;
    }
    
    function displayNumbers(numbers) {
        numbersDisplay.innerHTML = '';
        
        numbers.forEach((number, index) => {
            setTimeout(() => {
                const numberCard = document.createElement('div');
                numberCard.className = 'number-card animate-in';
                numberCard.textContent = number;
                
                // 각 번호마다 다른 색상 그라데이션
                const colors = [
                    'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                    'linear-gradient(135deg, #4ECDC4, #44A08D)',
                    'linear-gradient(135deg, #45B7D1, #96DED1)',
                    'linear-gradient(135deg, #FFA726, #FFB74D)',
                    'linear-gradient(135deg, #AB47BC, #CE93D8)'
                ];
                
                numberCard.style.background = colors[index % colors.length];
                numberCard.style.animationDelay = `${index * 0.1}s`;
                
                // 호버 효과 추가
                numberCard.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1) rotate(5deg)';
                });
                
                numberCard.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) rotate(0deg)';
                });
                
                numbersDisplay.appendChild(numberCard);
                
                // 사운드 효과 시뮬레이션 (진동)
                if ('vibrate' in navigator) {
                    navigator.vibrate(100);
                }
            }, index * 300); // 0.3초 간격으로 표시
        });
    }
    
    function resetApp() {
        numbersDisplay.innerHTML = '';
        resultContainer.classList.remove('show');
        drawButton.style.display = 'inline-block';
        drawButton.disabled = false;
        drawButton.innerHTML = '<i class="fas fa-dice me-2"></i>당번 뽑기!';
        drawButton.classList.remove('disabled');
        resetButton.style.display = 'none';
    }
    
    // 페이지 로드 시 애니메이션
    setTimeout(() => {
        document.querySelector('.modern-card').style.transform = 'translateY(0)';
        document.querySelector('.modern-card').style.opacity = '1';
    }, 100);
    
    // 배경 아이콘 랜덤 애니메이션
    function animateBackgroundIcons() {
        const icons = document.querySelectorAll('.floating-icon');
        icons.forEach(icon => {
            const delay = Math.random() * 20000;
            icon.style.animationDelay = delay + 'ms';
        });
    }
    
    animateBackgroundIcons();
});

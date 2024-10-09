// src/Fireworks.js

import  { useRef, useEffect } from 'react';

const Fireworks = ({ duration = 5000, density = 150, speed = 500 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        // Thiết lập kích thước canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Tạo một đối tượng Particle
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 6 + 1; // Kích thước ngẫu nhiên
                this.speedX = Math.random() * 6 - 3; // Tốc độ x ngẫu nhiên
                this.speedY = Math.random() * -15 - 1; // Tốc độ y ngẫu nhiên
                this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Màu sắc ngẫu nhiên
                this.friction = 0.98; // Giảm tốc
                this.gravity = 0.5; // Lực hấp dẫn
            }

            update() {
                this.speedY += this.gravity; // Cập nhật tốc độ y với lực hấp dẫn
                this.x += this.speedX; // Cập nhật vị trí x
                this.y += this.speedY; // Cập nhật vị trí y
                this.size *= this.friction; // Giảm kích thước
            }

            draw() {
                ctx.fillStyle = this.color; // Thiết lập màu sắc
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Vẽ particle
                ctx.fill();
            }
        }

        // Hàm để tạo ra các particles
        const createParticles = () => {
            const xPos = Math.random() * canvas.width; // Vị trí x ngẫu nhiên
            const yPos = Math.random() * canvas.height; // Vị trí y ngẫu nhiên
            for (let i = 0; i < density; i++) {
                particles.push(new Particle(xPos, yPos));
            }
        };

        // Hàm hoạt động
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas
            particles.forEach((particle, index) => {
                particle.update(); // Cập nhật particle
                particle.draw(); // Vẽ particle

                // Xóa particle nếu kích thước của nó quá nhỏ
                if (particle.size <= 0.3) {
                    particles.splice(index, 1);
                }
            });
            animationId = requestAnimationFrame(animate); // Gọi lại hàm animate
        };

        // Tạo bắn pháo hoa tự động
        const intervalId = setInterval(createParticles, speed); // Bắn pháo hoa theo tốc độ đã chỉ định
        setTimeout(() => {
            clearInterval(intervalId); // Dừng bắn pháo hoa sau thời gian đã chỉ định
        }, duration);

        animate(); // Bắt đầu hoạt động

        // Dọn dẹp
        return () => {
            cancelAnimationFrame(animationId);
            clearInterval(intervalId);
        };
    }, [duration, density, speed]); // Thêm duration, density và speed vào dependency array

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none', // Không cho phép canvas nhận sự kiện chuột
            }}
        />
    );
};

export default Fireworks;

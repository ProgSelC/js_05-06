;
(function() {
    function StopWatch() {
        var _totalElapsed = 0,
            _currentElapsed,
            _startDate,
            _isRunning = false;

        Object.defineProperty(this, "isRunning", {
            get: function() {
                return _isRunning;
            }
        });

        function pad(num, length) {
            var s = "0000" + num;
            return s.substr(s.length - length);
        }

        function formatTime(time) {
            var h = m = s = ms = 0;

            h = Math.floor(time / (60 * 60 * 1000));
            time = time % (60 * 60 * 1000);
            m = Math.floor(time / (60 * 1000));
            time = time % (60 * 1000);
            s = Math.floor(time / 1000);
            ms = time % 1000;

            return pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + '.' + pad(ms, 3);
        }

        this.start = function() {
            if (!_isRunning) {
                _isRunning = !_isRunning;
                _startDate = new Date().getTime();
            }
        }
        this.stop = function() {
            if (_isRunning) {
                _isRunning = !_isRunning;
                _currentElapsed = new Date().getTime() - _startDate;
                _totalElapsed += _currentElapsed;
            }
        }
        this.reset = function() {
            _isRunning = false;
            _totalElapsed = 0;
            _currentElapsed = 0;
        }
        this.getCurrentValue = function() {
            var time = (_isRunning) ? new Date().getTime() - _startDate : _currentElapsed;
            return formatTime(time);
        }
        this.getTotalValue = function() {
            var time = (_isRunning) ? _totalElapsed + new Date().getTime() - _startDate : _totalElapsed;
            return formatTime(time);
        }
    }

    var watch = new StopWatch(),
        display = document.getElementById('display'),
        controls = document.getElementById('controls'),
        info = document.getElementById('info'),
        refreshTimer;

    controls.addEventListener('click', function(e) {
        var button = e.target;
        switch (button.id) {
            case 'start':
                if (watch.isRunning) {
                    clearInterval(refreshTimer);
                    watch.stop();
                    button.className = 'btn btn-success';
                    button.innerHTML = 'Start';
                    var newInfoLine = document.createElement('li');
                    newInfoLine.innerHTML = 'Stop: ' + watch.getCurrentValue();
                    info.appendChild(newInfoLine);
                } else {
                    watch.start();
                    button.className = 'btn btn-warning';
                    button.innerHTML = 'Stop';
                    refreshTimer = setInterval(function() {
                        display.innerHTML = watch.getTotalValue();
                    }, 5);
                }
                break;
            case 'split':
                if (watch.isRunning) {
                    var newInfoLine = document.createElement('li');
                    newInfoLine.innerHTML = 'Split: ' + watch.getCurrentValue();
                    info.appendChild(newInfoLine);
                }
                break;
            case 'reset':
                clearInterval(refreshTimer);
                watch.reset();
                var startButton = document.getElementById('start');
                startButton.className = 'btn btn-success';
                startButton.innerHTML = 'Start';
                while (info.firstChild) {
                    info.removeChild(info.firstChild);
                }
                display.innerHTML = watch.getTotalValue();
                break;
        }
    });
}());

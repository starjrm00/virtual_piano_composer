# React로 웹서비스 만들어 보기

#### Mad Camp(2020-winter) 넷째 주 프로젝트

**데모버전:** [https://starjrm00.github.io/virtual_piano_composer/](https://starjrm00.github.io/virtual_piano_composer/)

### 1. 프로젝트 이름

Virtual_piano_composer

### 2. 기능 설명

#### 요약: React를 이용해, 컴퓨터 키보드로 피아노를 연주하며 음표가 찍히는 서비스 구현.


![scenario](https://user-images.githubusercontent.com/18097984/106758088-7465cc00-6674-11eb-8c12-9d6b20702ab4.gif)


- 피아노 각 건반에 할당된 키보드 버튼을 누르거나, 피아노 건반을 클릭해 해당 음을 연주 가능
- 피아노 연주 시 연주 시간에 따른 음표가 악보에 표기
- 표기된 악보는 JSON형식의 VP파일로 저장 가능 (VP파일은 virtual_piano의 약자로 본 프로그램의 악보를 뜻하는 확장자)
- 저장된 악보를 앱에 업로드 해 악보로 보고, 연주 듣기도 가능
- 페이지를 새로고침 해도 악보는 계속 저장되어있음
- 연주되는 악기의 종류 선택 가능
- BPM선택이 가능, 그려지는 악보는 해당 BPM을 기준으로 그려짐
- 그려진 악보에 기반한 연주를 재생, 정지 가능

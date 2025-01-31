MainView = class MainView extends AView {
    constructor() {
        super();
        this.pageSize = 30;
    }

    // 컴포넌트 초기화
    init(context, evtListener) {
        super.init(context, evtListener);
    }

    // 컴포넌트 초기화 완료
    onInitDone() {
        super.onInitDone();
        this.setCalendar(); // 캘린더 스타일을 설정
    }

    // 컴포넌트 활성화
    onActiveDone(isFirst) {
        super.onActiveDone(isFirst);
        this.getKrxListed(1); // KRX상장종목정보 검색
        this.initPreferGroup(); // 어코디언에 관심목록을 초기화
    }

    // KRXList 검색버튼 클릭시
    onClickGetKrxList(comp, info, e) {
        this.getKrxListed(1); // 현재 페이지 1로 세팅
    }

    // KRX api의 URL을 정의
    generateKrxListedUrl(selectedDate, pageNo, krxSelect, krxText) {
        const apiKey = '0fLxdjt%2BQz8p4o0Eva3C2UkljbIHBZ5wcswHUnv7JkBu6OXX%2FKGitGpluoEZFwtTp%2B8XbR9L17Sv9fmDwu7azg%3D%3D'; // 일반 인증키
        return `https://apis.data.go.kr/1160100/service/GetKrxListedInfoService/getItemInfo?serviceKey=${apiKey}&basDt=${selectedDate}&numOfRows=${this.pageSize}&pageNo=${pageNo}&${krxSelect}=${krxText}`; // (템플릿 리터럴 ``을 사용하여 변수 삽입)
    }

    // KRX상장종목정보 검색
    getKrxListed(pageNo) {
        this.listedStockGrid.removeAll(); // 그리드 초기화
        const selectedDate = this.calendar.getDateString(); // 현재 날짜
        const krxSelect = this.krxSelect.getData(); // 검색 옵션
        const krxText = this.krxText.getText(); // 검색 텍스트

        // API에 URL로 데이터
        const url = this.generateKrxListedUrl(selectedDate, pageNo, krxSelect, krxText);

        // 비동기로 데이터 요청 (AJAX)
        $.ajax({
            type: 'GET',
            url: url,
            success: (result) => this.handleKRXListedSuccess(result), // 성공 시 처리
            error: (error) => this.handleKRXListedError(error) // 실패 시 처리
        });
    }

    // KRX상장종목정보 검색 success
    handleKRXListedSuccess(result) {
        const totalCount = $(result).find('totalCount').text(); // 검색한 목록의 전체 데이터 개수

        // 전체 데이터 개수 설정
        if (totalCount == 0) {
            this.updatePageInfo(0, 0); // 검색된 데이터가 없으면 메인 페이지 정보를 0 / 0으로 설정
        } else { // 데이터가 조회된다면
            const pageNo = $(result).find('pageNo').text(); // 현재 페이지
            const numOfRows = $(result).find('numOfRows').text(); // 한 페이지 결과수
            const totalPages = Math.ceil(Number(totalCount) / numOfRows); // 총 페이지수 : 전체 데이터 개수 / 출력 데이터 개수
        
            this.krxNextBtn.setData(pageNo); // 버튼으로 현재 페이지를 넘기고
            this.nowPage.setText(this.krxNextBtn.data); // UI에 현재 페이지값과
            this.totalCount.setText(totalPages); // UI에 전체 페이지값을 나타낸다
        }

        // 그리드에 데이터 추가
        this.addItemKRXGrid(result);
    }

    // KRX상장종목정보 검색 error (예외 처리)
    handleKRXListedError() {
        AToast.show('KRX 상장 종목 정보를 불러오는데 실패했습니다.');
    }

    // 그리드에 데이터 추가
    addItemKRXGrid(result) { // 반복 메서드로
        $(result).find('item').each((index, itemElement) => { // 검색된 요소들을 가져오고,
            const preferBtn = this.settingBtn(index); // 관심 버튼 설정 ( 로우 값을 미리 저장 )
            preferBtn.addEventListener('click', () => this.onClickKrxBtn(preferBtn)); // 콜백 함수로 전달하려면 화살표 함수로 전달 / 클릭이벤트를 설정

            var item = [
                $(itemElement).find('corpNm').text(), // 회사 정식 명칭
                $(itemElement).find('mrktCtg').text(), // 종목 코드
                $(itemElement).find('srtnCd').text(), // 시장 구분
                $(itemElement).find('itmsNm').text(),  // 회사 이름
                preferBtn // 초기화한 버튼
            ];

            // 그리드에 item목록 추가
            this.listedStockGrid.addRow(item);
        });
    }

    // KRX 처음 버튼 클릭
    onClickFirstKrxPage(comp, info, e) {
        if (this.krxNextBtn.data == 1) return;  // 현재 페이지가 첫 페이지라면 버튼 안눌림

        this.getKrxListed(1);
    }

    // KRX 이전 버튼 클릭
    onClickPrevKrxPage(comp, info, e) {
        if (this.krxNextBtn.data == 1) return;

        this.getKrxListed(Number(this.krxNextBtn.data) - 1); // pageNo 버튼 데이터 -1로 넘기기
    }

    // KRX 이전 10 버튼 클릭
    onClickPrevKrxPage10(comp, info, e) {
        const pageNo = Number(this.krxNextBtn.data); // 현재 페이지 가져오기
        if (this.krxNextBtn.data == 1) return;

        this.getKrxListed(this.pageSize > pageNo ? 1 : pageNo - 10); // 페이지 사이즈보다 현재 페이지가 작다면 1페이지로 가기
    }

    // KRX 마지막 클릭
    onClickLastKrxPage(comp, info, e) {
        if (this.krxNextBtn.data == Number(this.totalCount.getText())) return; // 현재 페이지가 마지막 페이지라면 안눌림

        this.getKrxListed(Number(this.totalCount.getText())); // 총 페이지 수(마지막)으로 이동
    }

    // KRX 다음 클릭
    onClickNextKrxPage(comp, info, e) {
        if (this.krxNextBtn.data == Number(this.totalCount.getText())) return;

        const nowPage = Number(this.krxNextBtn.data); // 현재 페이지를 버튼에서 가져오기
        this.getKrxListed(nowPage + 1);
    }

    // KRX 다음 10 클릭
    onClickNextKrxPage10(comp, info, e) {
        if (this.krxNextBtn.data == Number(this.totalCount.getText())) return;

        const nowPage = Number(this.krxNextBtn.data);
        const totalCount = Number(this.totalCount.getText());

        this.getKrxListed(nowPage >= totalCount - 10 ? totalCount : nowPage + 10); // 현재 페이지가 전체 페이지 - 10보다 크거나 같으면 마지막 페이지로 이동 ( 10 페이지씩 이동 )
    }

    // 어코디언 관심종목 그룹 초기화
    initPreferGroup(selectedGroup) { // 선택된 그룹이 파라미터로 넘어옴
        let groups = this.getGroups(); // localStorage에서 그룹 들고오기
        
        // 배열이 아니거나 길이가 0이면
        if (!Array.isArray(groups) || groups.length === 0) { 
            groups = [{  Name: '관심그룹001', stocks: [] }]; // 기본 배열로 초기화
            this.setGroups(groups);
        }  
        this.renderPreferGroups(groups, selectedGroup); // 그룹을 어코디언에 렌더링
    }

    // 어코디언에 관심종목 렌더링
    renderPreferGroups(groups, selectedGroup) {
        this.preferList.removeAllItems(); // 아코디언 초기화

        // 아코디언에 그룹명으로 목록들을 추가한다
        groups.forEach(group => {this.preferList.insertItem(group.Name, 'Source/Items/Item.lay')});

        // Promise로 DOM 업데이트가 안료된 후 선택된 그룹을 펼친다
        new Promise((resolve) => { // resolve는 Promise가 완료될 때 호출할 함수
            typeof window !== 'undefined' ? requestAnimationFrame(() => resolve()) : resolve();
        }).then(() => {
            this.preferList.showHideByName(selectedGroup);
        });
    }

    // 관심그룹 추가
    onClickAddPreferGroup(comp, info, e) {
        let groups = this.getGroups(); // local Storage에서 데이터 가져오기
        let groupName = this.generateUniqueGroupName(groups); // 그룹명 중복확인하여 중복이 아닌 그룹명을 가져옴

        const newGroup = { Name : groupName, stocks: [1]}; // 새 객체에 담는다

        this.setGroups([...groups, newGroup]); // 그룹에 데이터를 추가
        this.initPreferGroup(this.preferList.selectedItem);
    }

    // 중복되지 않는 그룹명을 생성하는 함수
    generateUniqueGroupName(groups) {
        const baseGroupName = '관심그룹'; // default 그룹명 설정
        let groupNumber = 1; // 그룹명 뒤에 붙을 숫자

        while (groups.some(group => group.Name === `${baseGroupName}${String(groupNumber).padStart(3, '0')}`)) { // 3자리 수보다 짧을 경우 0을 추가한다
            groupNumber++;
        }
        return `${baseGroupName}${String(groupNumber).padStart(3, '0')}`;
    }

    // 어코디언에 관심그룹 선택 삭제
    onClickDeletePreferGroup(comp, info, e){
        if (!this.preferList.selectedItem) return AToast.show('선택된 그룹이 없습니다.'); // 예외처리
        if (this.getGroups().length === 1) return AToast.show('최소한 하나의 그룹은 존재해야 합니다.');
        const selectedGroup = this.preferList.selectedItem.menu.innerText; // 선택된 그룹을 가져와서
        
        const updatedGroups = this.getGroups().filter(group => group.Name !== selectedGroup); // 삭제할 선택된 그룹을 제외한 배열을 가져와
        this.setGroups(updatedGroups); // 검색한 그룹 목록을 localStorage에 저장
        this.initPreferGroup(); // 그룹 목록을 화면에 다시 그리기
    }

    // 관심종목 그룹 전체삭제
    onClickDeleteAllPreferGroup(comp, info, e){
        localStorage.removeItem('groups'); // local 저장소의 groups 전체를 삭제
        this.initPreferGroup();
    }

    // 그룹명 수정버튼 클릭
    onClickEditPreferGroup(comp, info, e){
        if (!this.preferList.selectedItem) return AToast.show('선택된 그룹이 없습니다.');
        const selectedGroup = this.preferList.selectedItem.menu.innerText;

            const window = new AWindow(); // 수정하는 창을 띄워
            window.openCenter('Source/window/edit.lay', null, 430, 110);
            window.setResultCallback((result, data) => { // 창이 닫힐때 값을 받아오고
                if (data) {
                    this.updatePreferGroupName(selectedGroup, data); // 수정 함수 실행
                }
        });
    }

    // 그룹명 수정시 
    updatePreferGroupName(oldGroupName, newGroupName){
        let groups = this.getGroups();

        if (groups.some(group => group.Name === newGroupName)) {
            return AToast.show('이미 존재하는 그룹명입니다');
        }

        // 이전의 그룹명의 index를 가져와 값을 수정
        let index = groups.findIndex(group => group.Name === oldGroupName); // 그룹안에 같은 그룹명이 중복인지 확인
        if (index !== -1) { // 중복이 아니라면
            groups[index].Name = newGroupName; // 이름을 수정
            this.setGroups(groups);
            this.initPreferGroup(newGroupName);
        }
    }

    // KRX그리드의 관심 관심목록 추가 클릭
    onClickKrxBtn(btn) {
        const countRow = this.listedStockGrid.columnCount - 1; // 버튼 컬럼을 제외한 열의 개수를 가져온다
        const addList = []; // 추가할 종목 저장할 임시 배열을 선언

        for (let i = 0; i < countRow; i++) { // 관심 버튼을 누른 값들을 반복문으로 배열에 저장
            addList[i] = this.listedStockGrid.getCell(Number(btn.dataset.index), i).textContent;
        }

        // 관심그룹에 종목 추가
        try {
            const selectedGroup = this.preferList.selectedItem.menu.innerText; // 선택되어 있는 어코디언 그룹을 가져와서
            if (!selectedGroup) { // 예외 처리
                AToast.show('선택된 그룹이 없습니다.');
                return;
            }

            const groups = this.getGroups(); // localStorage에서 그룹 목록 가져오기
            const index = groups.findIndex(group => group.Name === selectedGroup);// 가져온 그룹과 어코디언에서 선택된 관심그룹명과 같은 그룹의 인덱스 값 찾기

            if (index === -1) return AToast.show('선택된 그룹이 없습니다.');

            if (groups[index].stocks.some(stock => stock[0] === addList[0])) { // 이미 저장되어 있는 항목인지 확인 / some : 만족하는 요소가 하나라도 있으면 true 반환
                return AToast.show('이미 저장된 종목입니다.');
            }
            // 중복이 없다면 종목 추가
            groups[index].stocks.push(addList); // 불러온 그룹에 목록 추가
            this.setGroups(groups); // localStorage에 반영
            this.initPreferGroup(selectedGroup); // 선택된 그룹으로 초기화
        } catch (e) {
            AToast.show('선택된 그룹이 없습니다.');
        }
    }

    // ------------------------------------------------------------------------------------------------------

    // 관심 버튼 설정 (index로 로우 구분)
    settingBtn(index) {
        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = '추가';
        btn.dataset.index = index; // 파라미터로 넘어온 현재 페이지

        return btn;
    }

    // UI에서 KRX그리드의 현재와 전체 페이지 수를 나타냄
    updatePageInfo(currentPage, totalPages) {
        this.totalCount.setText(currentPage);
        this.nowPage.setText(totalPages);
    }

    // 캘린더 이전 날짜
    onClickbeforeCal() {
        this.calendar.setDate(this.calendar.getDiffDate(-1));
    }

    // 캘린더 다음 날짜
    onClickafterCal() {
        this.calendar.setDate(this.calendar.getDiffDate(+1));
    }

    // 캘린더 설정
    setCalendar() {
        this.calendar.setCalendarPickerStyle({ // 캘린더 스타일 수정
            'color': 'rgb(147, 159, 178)', 
            'border-width': '0px', 
            'border-radius': '5px'
        });
    }

    // localStorage에서 그룹 가져오기
    getGroups() {
        return JSON.parse(localStorage.getItem('groups')) || [];
    }

    // localStorage에 그룹 저장
    setGroups(groups) {
        localStorage.setItem('groups', JSON.stringify(groups));
    }

}
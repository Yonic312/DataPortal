
MainView = class MainView extends AView {
    constructor() {
        super();
    }

    init(context, evtListener) {
        super.init(context, evtListener);
    }

    onInitDone() {
        super.onInitDone();

        // 캘린더 스타일 수정
        this.calendar.setCalendarPickerStyle({
            'color': 'rgb(147, 159, 178)', 
            'border-width': '0px', 
            'border-radius': '5px'
        });
    }

    onActiveDone(isFirst) {
        super.onActiveDone(isFirst);

        // KRX상장종목정보 검색
        this.getKrxListed(1);

        // 관심그룹 초기화
        this.initPreferGroup();
    }

    // KRXList 검색버튼 클릭
    onClickGetKrxList(comp, info, e) {
        this.getKrxListed(1); // 현재 페이지 1로 세팅
    }

    // KRX상장종목정보 검색
    getKrxListed(pageNo) {
        this.listedStockGrid.removeAll(); // 그리드 초기화

        const currentDate = this.calendar.getDateString(); // 현재 날짜
        const apiKey = '0fLxdjt%2BQz8p4o0Eva3C2UkljbIHBZ5wcswHUnv7JkBu6OXX%2FKGitGpluoEZFwtTp%2B8XbR9L17Sv9fmDwu7azg%3D%3D'; // 일반 인증키
        const krxSelect = this.krxSelect.getData(); // 검색 옵션
        const krxText = this.krxText.getText(); // 검색 텍스트

        // API 요청 URL
        const url = 'https://apis.data.go.kr/1160100/service/GetKrxListedInfoService/getItemInfo?serviceKey='
                    + apiKey + '&basDt=' + currentDate + '&pageNo=' + pageNo + '&' + krxSelect + '=' + krxText;

        // AJAX 요청
        $.ajax({
            type: 'GET',
            url: url,
            success: (result) => this.handleKRXListedSuccess(result), // 성공 시 처리
            error: (error) => this.handleKRXListedError(error) // 실패 시 처리
        });
    }

    handleKRXListedSuccess(result) {
        const totalCount = $(result).find('totalCount').text(); // 전체 데이터 개수

        // 전체 데이터 개수 설정
        if (totalCount === '' || totalCount == 0) {
            this.updatePageInfo(0, 0); // 가져온 데이터가 없으면 페이지 정보를 0으로 설정
        } else {
            // 버튼에 현재 페이지값 넘기기
            this.krxNextBtn.setData($(result).find('pageNo').text()); // 버튼으로 현재 페이지를 넘기고
            this.nowPage.setText(this.krxNextBtn.data); // UI에 현재 페이지값을 할당
            this.totalCount.setText(Math.ceil(Number($(result).find('totalCount').text()) / Number($(result).find('numOfRows').text()))); // UI에 전체 개수 할당
        }

        // 그리드에 데이터 추가
        this.addItemKRXGrid(result);
    }

    handleKRXListedError(error) {
        console.error('KRX 상장 종목 정보 검색 실패:', error);
    }

    updatePageInfo(currentPage, totalPages) {
        this.totalCount.setText(currentPage);
        this.nowPage.setText(totalPages);
    }

    addItemKRXGrid(result) {
        $(result).find('item').each((index, itemElement) => {

            var item = [
                $(itemElement).find('corpNm').text(), // 회사 정식 명칭
                $(itemElement).find('mrktCtg').text(), // 종목 코드
                $(itemElement).find('srtnCd').text(), // 시장 구분
                $(itemElement).find('itmsNm').text()  // 회사 이름
            ];

            // 그리드에 item목록 추가
            this.listedStockGrid.addRow(item);
        });
    }

    // ------------------------------------------------------- 여기부터는 코드수정하면 됨 / 함수명은 수정 완료

    // 처음 클릭
    onClickFirstKrxPage(comp, info, e) {
        if (this.nowPage.getText() == 1) { return; } // 현재 페이지가 첫 페이지라면 버튼 안눌림
        this.getKrxListed(1);
    }

    // 이전 10 클릭
    onClickPrevKrxPage10(comp, info, e) {
        

        // 현재 페이지가 첫 번째 페이지라면 버튼 안눌림
        if (this.krxNextBtn.data < 2 || this.krxNextBtn.data === undefined) { return; }

        // 현재 페이지가 출력 페이지수보다 작으면 첫 페이지
        if(this.nowPage.getText() < 10){ // 10을 바꿔야함
            this.getKrxListed(1);
            return;
        }
        this.getKrxListed(Number(this.krxNextBtn.data) - 10); // pageNo 버튼 데이터 -1로 넘기기
	}

    // 이전 클릭
    onClickPrevKrxPage(comp, info, e) {
        // 현재 페이지가 첫 번째 페이지라면 버튼 안눌림
        if (this.krxNextBtn.data < 2 || this.krxNextBtn.data === undefined) { return; }
        this.getKrxListed(Number(this.krxNextBtn.data) - 1); // pageNo 버튼 데이터 -1로 넘기기
    }

    

    // 다음 클릭
    onClickNextKrxPage(comp, info, e) {
        // 현재 페이지가 마지막 페이지라면 버튼 안눌림
        if (this.krxNextBtn.data > Number(this.totalCount.getText()) - 1 || this.krxNextBtn.data === undefined) { return; }

        const nowPage = this.krxNextBtn.data === undefined ? 1 : Number(this.krxNextBtn.data);
        this.getKrxListed(nowPage + 1); // pageNo 버튼 데이터 + 1로 넘기기
    }

    // 다음 10 클릭
    onClickNextKrxPage10(comp, info, e) {
        // 현재 페이지가 마지막 페이지라면 버튼 안눌림
        if (this.krxNextBtn.data > Number(this.totalCount.getText()) - 1 || this.krxNextBtn.data === undefined) { return; }

        // 현재 페이지가 출력 페이지수보다 작으면 첫 페이지
        if(this.nowPage.getText() > this.totalCount.getText() - 10){ // 10을 바꿔야함
            this.getKrxListed(this.totalCount.getText());
            return;
        }

        const nowPage = this.krxNextBtn.data === undefined ? 1 : Number(this.krxNextBtn.data);
        this.getKrxListed(nowPage + 10); // pageNo 버튼 데이터 + 1로 넘기기
    }

    // 마지막 클릭
    onClickLastKrxPage(comp, info, e) {
        if (this.totalCount.getText() == this.krxNextBtn.data) { return; } // 현재 페이지가 마지막 페이지라면 안눌림
        this.getKrxListed(Number(this.totalCount.getText()));
    }

    // 관심종목 그룹 초기화
    initPreferGroup() {
        let groups = JSON.parse(localStorage.getItem('groups'));

        if (!Array.isArray(groups)) {
            groups = [];
        }

        if (groups.length === 0) { // 만약 그룹이 하나도 없다면
            groups = [{
                groupName: '관심그룹001',
                stocks: [0]
            }];
            localStorage.setItem('groups', JSON.stringify(groups)); // localStorage에 추가
        }

        this.renderPreferGroups(groups); // 그룹을 어코디언에 렌더링
    }

    // 관심종목 그룹 추가
    onClickAddPreferGroup(comp, info, e) {
        let groups = JSON.parse(localStorage.getItem('groups')) || []; // 그룹목록 데이터를 가져와서
        if (!Array.isArray(groups)) {
            groups = [];
        }

        const nextGroupNumber = groups.length + 1;
        const newGroup = { // 그룹을 객체 형태로 저장
            groupName: `관심그룹${String(nextGroupNumber).padStart(3, '0')}`, // padStart?
            stocks: [1]
        }

        groups.push(newGroup);
        localStorage.setItem('groups', JSON.stringify(groups));

        this.initPreferGroup(); // 관심그룹 다시 그리기
    }

    // 어코디언에 관심종목 렌더링
    renderPreferGroups(groups) {
        this.preferList.removeAllItems(); // 아코디언 초기화

        groups.forEach(group => {
            // 아코디언 항목 추가
            this.preferList.insertItem(group.groupName, 'Source/Items/Item.lay'); // 그룹이름으로 어코디언에 아이템 추가
        });
    }

    // 어코디언에 관심종목 선택 삭제
    onClickDeletePreferGroup(comp, info, e) {
        try {
            let selectedGroup = this.preferList.selectedItem.innerText.split(/\s+/)?.[0]; // ['관심그룹004', 'col1', 'col2', 'col3', '']?.[0]
            if (!selectedGroup) {
                console.warn('선택된 그룹이 없습니다.');
                return;
            }

            // localStorage에서 그룹 목록 가져오기
            let groups = JSON.parse(localStorage.getItem('groups')) || []; // null 값을 대비하여 빈 배열을 사용 / 이후 배열 메서드를 사용할 때를 대비

            // 선택된 그룹의 인덱스를 찾기
            let index = groups.findIndex(group => group.groupName === selectedGroup); // 배열의 객체(group)의 Name을 비교해서 선택된 값과 같은지 비교

            // 그룹이 존재하면 배열에서 삭제
            if (index !== -1) {
                groups.splice(index, 1);
            } else {
                console.warn('그룹을 찾지 못했습니다.');
            }

            // 변경된 그룹 목록을 localStorage에 저장
            localStorage.setItem('groups', JSON.stringify(groups));

            // 그룹 목록을 화면에 다시 그리기
            this.initPreferGroup();

        } catch (e) {
            console.warn('선택된 그룹이 없습니다.');
        }
    }

    onClickDeleteAllPreferGroup(comp, info, e) {
        localStorage.removeItem('groups');

        // 그룹 목록을 화면에 다시 그리기
        this.initPreferGroup();
    }

    onClickEditPreferGroup(comp, info, e) {
        try {
            // 선택 그룹 가져오기 (없으면 함수 종료)
            const selectedGroup = this.preferList.selectedItem.innerText.split(/\s+/)?.[0]; // ?. : 값이 없으면 undefined 반환
            if (!selectedGroup) {
                console.warn('선택된 그룹이 없습니다.');
                return;
            }

            // Edit창 불러오기
            const window = new AWindow();
            window.openCenter('Source/window/edit.lay', null, 430, 110);

            // 결과 콜백 설정
            window.setResultCallback((result, data) => {
                if (data) {
                    console.log('수정된 데이터:', data);
                    this.updatePreferGroupName(selectedGroup, data);
                } else {
                    console.warn('수정 데이터가 없습니다.');
                }
            });
        } catch (e) {
            console.warn('선택된 그룹이 없습니다.');
        }
    }

    updatePreferGroupName(oldName, newName) {
        let groups = JSON.parse(localStorage.getItem('groups')) || [];

        if (groups.includes(newName)) {
            console.log('이미 존재하는 그룹명입니다');
            return;
        }

        let index = groups.indexOf(oldName);
        console.log('index : ', index);
        if (index !== -1) {
            groups[index] = newName;
        }

        localStorage.setItem('groups', JSON.stringify(groups));

        this.initPreferGroup();
        console.log('업데이트 완료');
    }
}
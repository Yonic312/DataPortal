
MainView = class MainView extends AView {
	constructor() {
		super();
	}

	init(context, evtListener) {
		super.init(context, evtListener);
	}

	onInitDone() {
		super.onInitDone();

        this.searchListedStock(); // KRX상장종목정보 검색
        this.calendar.setCalendarPickerStyle({'color' : 'rgb(147, 159, 178)', 'border-width':'0px', 'border-radius' : '5px'}); // 캘린더 스타일 수정
        console.log('ac : ',this.preferList);
	}

	onActiveDone(isFirst) {
		super.onActiveDone(isFirst);
        this.initPreferGroup(); // 그룹 만들기
	}

    // 검색버튼 클릭시
	clickSearchListedStock(comp, info, e) {
        this.searchListedStock(1);
    }

    // KRX상장종목정보 검색
    searchListedStock(pageNo) {
        this.listedStockGrid.removeAll(); // 그리드 초기화

        const thisObj = this;
        const nowTime = this.calendar.getDateString();
        const apiKey = '0fLxdjt%2BQz8p4o0Eva3C2UkljbIHBZ5wcswHUnv7JkBu6OXX%2FKGitGpluoEZFwtTp%2B8XbR9L17Sv9fmDwu7azg%3D%3D'; // 일반 인증키

        const krxSelect = this.krxSelect.getData(); // 검색 옵션
        const krxText = this.krxText.getText(); // 검색 텍스트
        const url = 'https://apis.data.go.kr/1160100/service/GetKrxListedInfoService/getItemInfo?serviceKey='
                    + apiKey + '&basDt=' + nowTime + '&pageNo=' + pageNo + '&' + krxSelect + '=' + krxText; 

        $.ajax({
            type:'GET',
            url: url,
            success: function(result){
                // XML 데이터를 jquery로 파싱하여 totalCount 가져오기
                var totalCount = $(result).find('totalCount').text();
                
                // 전체 데이터 개수 설정
                if(totalCount === '' || totalCount == 0) {
                    thisObj.totalCount.setText(0);
                    thisObj.nowPage.setText(0);
                } else{
                    // 버튼에 현재 페이지값 넘기기
                    thisObj.krxNextBtn.setData($(result).find('pageNo').text()); // 버튼으로 현재 페이지를 넘기고
                    thisObj.nowPage.setText(thisObj.krxNextBtn.data); // UI에 현재 페이지값을 할당
                    thisObj.totalCount.setText(Math.ceil(Number($(result).find('totalCount').text()) / Number($(result).find('numOfRows').text()))); // UI에 전체 개수 할당
                }
                
                // 그리드에 데이터 등록
                $(result).find('item').each(function() {
                    var item = [
                        $(this).find('corpNm').text(), // 회사 정식 명칭
                        $(this).find('mrktCtg').text(), // 종목 코드
                        $(this).find('srtnCd').text(), // 시장 구분
                        $(this).find('itmsNm').text()  // 회사 이름
                    ]
                    // 그리드에 item목록 추가
                    thisObj.listedStockGrid.addRow(item);
                });
            }
        })
    }

    clickKrxBeforeBtn(comp, info, e) {
        // 현재 페이지가 첫 번째 페이지라면 버튼 안눌림
        if(this.krxNextBtn.data < 2 || this.krxNextBtn.data === undefined) {return;} 
        this.searchListedStock(Number(this.krxNextBtn.data) -1); // pageNo 버튼 데이터 -1로 넘기기
	}

	clickKrxNextBtn(comp, info, e) {
        // 현재 페이지가 마지막 페이지라면 버튼 안눌림
        if(this.krxNextBtn.data > Number(this.totalCount.getText())-1 || this.krxNextBtn.data === undefined) {return;}

        const nowPage = this.krxNextBtn.data === undefined ? 1 : Number(this.krxNextBtn.data);
        this.searchListedStock(nowPage + 1); // pageNo 버튼 데이터 + 1로 넘기기

	}

	clickKrxFirstBtn(comp, info, e) {
        if(this.nowPage.getText() == 1){return;} // 현재 페이지가 첫 페이지라면 버튼 안눌림
        this.searchListedStock(1);
	}

    clickKrxLastBtn(comp, info, e) {
        if(this.totalCount.getText() == this.krxNextBtn.data){return;} // 현재 페이지가 마지막 페이지라면 안눌림
        this.searchListedStock(Number(this.totalCount.getText()));
	}







    // 관심종목 추가
	clickAddGroupBtn(comp, info, e)
	{
        let groups = JSON.parse(localStorage.getItem('groups')); // 그룹목록 데이터를 가져와서
        const nextGroupNumber = groups.length + 1;
        const newGroup = `관심그룹${String(nextGroupNumber).padStart(3, '0')}`;
        groups.push(newGroup);
        localStorage.setItem('groups', JSON.stringify(groups));

        this.initPreferGroup(); // 관심그룹 다시 그리기

	}

    // 그룹 초기화
    initPreferGroup () {
        let group = JSON.parse(localStorage.getItem('groups'));
        
        if(!group) { // 만약 그룹이 하나도 없다면
            group = ['관심그룹001']; // default 값 생성
            localStorage.setItem('groups', JSON.stringify(group)); // localStorage에 추가
            }

        this.displayGroups(group); // 그룹을 화면에 그리기
    }

    // 그룹 그리기
    displayGroups(group) {
        this.preferList.removeAllItems(); // 어코디언 초기화

        group.forEach(item => {
            this.preferList.insertItem(item, 'Source/Items/Item.lay'); // 어코디언에 데이터 넣기
        })
    }

    // 관심종목 전체 삭제
	clickDeleteAllGroupBtn(comp, info, e) {
        this.preferList.removeAllItems();

        let group = JSON.parse(localStorage.getItem('groups')); // 그룹을 가져와서
        localStorage.removeItem('groups');
        this.initPreferGroup(); // 그룹을 화면에 그리기
	}
}

Item = class Item extends AView {
	constructor() {
		super();
	}

	init(context, evtListener) {
		super.init(context, evtListener);
	}

	onInitDone() {
		super.onInitDone();
	}

	onActiveDone(isFirst) {
		super.onActiveDone(isFirst);
        this.getItemList(); // 그리드 나타내기
	}

    getItemList() { // 선택된 어코디언 목록의 그리드를 출력
        this.ItemGrid.removeAll();

        const selectedGroup = this.getSelectedGroup();

        // 로컬 스토리지에서 'groups' 키에 저장된 데이터를 가져오기
        const groups = this.getGroups();

        // 저장소에서 가져온 데이터와 어코디언 박스의 네임과 일치하는 그룹 가져오기
        const groupFound = groups.find(group => group.Name.trim() === selectedGroup);

        // 체크박스 생성
        if(!groupFound){
            AToast.show('검색된 배열이 없습니다.')
            return;
        }

        // 그리드에 체크박스를 포함하여 나타내기
        groupFound.stocks.forEach(group => {
            const checkBox = this.settingCheckBox();

            const data = [
                group[0],
                group[1],
                group[2],
                group[3],
                checkBox
            ]

            if(group[0] != undefined){ // 배열안에 값이 있다면 로우 추가
                this.ItemGrid.addRow(data);
            }
        }); 
    }

    // 체크박스 설정
    settingCheckBox(){
        const checkBox = document.createElement('input'); 
        checkBox.type = 'checkbox';
        checkBox.style.width = '20px';  // 너비 설정
        checkBox.style.height = '20px'; // 높이 설정
        return checkBox;
    }

    // 선호 종목 모두 삭제
    onClickPreferDeleteAll() {
        const selectedGroup = this.getSelectedGroup();

        // 로컬 스토리지에서 'groups' 키에 저장된 데이터를 가져오기
        const groups = this.getGroups();

        // select된 그룹의 종목을 모두 삭제
        const groupFound = groups.find(group => group.Name === selectedGroup); // 그룹의 이름을 가져와서
        if(groupFound){
            groupFound.stocks=[]; // 그룹을 초기화
        }

        this.setGroups(groups);
        this.getItemList();
    }

	onClickPreferDeleteSelect(comp, info, e) {
        const columnCount = this.ItemGrid.getRowCount(); // 그리드의 행 개수 가져오기
        const deleteList = []; // 삭제 목록을 담을 배열

        for(let i = 0; i < columnCount; i++) { // 그리드 전체항목을 반복
            // 체크된 항목 가져오기
            const isChecked = this.ItemGrid.getCell(i,4).querySelector('input[type="checkbox"]').checked; 
            if(isChecked){ // 체크가 되어있다면 삭제 목록에 담기
                const itemName = this.ItemGrid.getCell(i,0).innerText; // 삭제할 목록명 가져오기
                deleteList.push(itemName);
            }
        }

        if(deleteList.length === 0){
            AToast.show('삭제할 항목을 골라주세요.');
            return;
        }

        // selectedGroup을 가져와서
        const selectedGroup = this.getSelectedGroup();

        // local 저장소에서 그룹들 가져오기
        const groups = this.getGroups();

        // 가져온 어코디언 박스의 이름과 local 저장소의 이름을 비교하여 index 가져오기
        let index = groups.findIndex(group => group.Name === selectedGroup); // 배열의 객체(group)의 Name을 비교해서 선택된 값과 같은지 비교

        // local 저장소에서 가져온 종목들을 필터링하여 deleteList에 포합되지 않은 항목만 남기기
        groups[index].stocks = groups[index].stocks.filter(stock => !deleteList.includes(stock[0]));
        
        // 변경된 데이터를 반환
        this.setGroups(groups);

        this.getItemList();
	}

    // localStorage에서 그룹 가져오기
    getGroups() {
        return JSON.parse(localStorage.getItem('groups')) || [];
    }

    // localStorage에 그룹 저장
    setGroups(groups) {
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    getSelectedGroup(){
        // 선택된 어코디언 박스의 이름을 가져오기
        const getMainCntr = AContainer.findOpenContainer('main').view;

        // 선택된 어코디언 박스의 이름을 가져오기
        let selectedGroup = []; // 선택된 그룹명을 받을 배열 선언
        let innerText = getMainCntr.preferList.selectedItem.innerText.split(/\s+/); // 공백을 기준으로 데이터를 나눈다

        let col1Index = innerText.indexOf('회사'); // 그룹명이 아닌 텍스트가 나오는 첫 번째 index값 

        // col1 전까지의 값들을 selectedGroup에 추가
        for (let i = 0; i < col1Index; i++) {
            selectedGroup.push(innerText[i]);
        }

        // selectedGroup을 공백으로 합침
        selectedGroup = selectedGroup.join(' ');
        return selectedGroup;
    }
}
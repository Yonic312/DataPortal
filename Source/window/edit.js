
edit = class edit extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

        // 컨테이너 가져오기
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

		this.editGroupName.setText(selectedGroup);

	}

	clickCancelBtn(comp, info, e)
	{
        this.getContainer().close();

	}

	clickEditBtn(comp, info, e) {
        const data = this.editGroupName.getText();
        
        if(data[0] === ' ') {
            AToast.show('그룹명 앞에 공백을 사용할 수 없습니다.');
            return;
        }

        if(!data){
            AToast.show('그룹명을 입력해 주세요.');
            return;
        }
        this.getContainer().close(0, data);
	}
}


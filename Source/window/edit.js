
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

		//TODO:edit here

	}

	clickCancelBtn(comp, info, e)
	{
        this.getContainer().close();

	}

	clickEditBtn(comp, info, e) {
        const data = this.editGroupName.getText();
        if(!data){
            // AToast('그룹명을 입력해주세요.');
            console.log('그룹명x');
            return;
        }
        this.getContainer().close(0, data);
	}
}


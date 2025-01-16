
Item = class Item extends AView
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

        const getMainCntr = AContainer.findOpenContainer('main').view;

        const getMainAccordion = getMainCntr.preferList.selectedItem.innerText;
        const mainAccordion = getMainAccordion.split(/\s+/)[0]; // 가져온 텍스트에서 그룹 이름만 가져오기
        console.log(mainAccordion);

        // this.groupTitle.setData(mainAccordion);

        console.log('mainAccordion : ',mainAccordion);

	}

}
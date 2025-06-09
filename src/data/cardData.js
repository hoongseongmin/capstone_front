// 파일 위치: src/data/cardData.js
// 설명: 캐릭터별 추천 카드 데이터 (혜택 텍스트 줄바꿈 처리)
// 각 캐릭터마다 3개의 추천 카드 정보

export const cardRecommendations = {
  // 대중교통 말스터 (교통비 중심)
  "대중교통 말스터": [
    {
      id: 1,
      name: "삼성 iD MOVE 카드",
      company: "삼성카드",
      benefits: "대중교통 10%할인\n택시 10%할인\n해외 항공철도 1.5%할인",
      image: "/images/cards/samsung-id-move.png",
      link: "https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1762&alncmpC=CYBERBR&affcode=QFBANKTEST04&webViewFirstPage=true"
    },
    {
      id: 2,
      name: "IBK I-어디로든 그린카드",
      company: "IBK기업은행",
      benefits: "친환경 자동차 40%\n대중교통 10%\n공유 모빌리티 10%",
      image: "/images/cards/ibk-green.png",
      link: "https://cardapplication.ibk.co.kr/card/index.do?card_prdc_id=103214&ad_cd=bspc&mz_cd=IRAINST"
    },
    {
      id: 3,
      name: "신한 B.Big",
      company: "신한카드",
      benefits: "대중교통 최대 18000원 할인\n택시 10%할인",
      image: "/images/cards/shinhan-bbig.png",
      link: "https://www.shinhancard.com/pconts/html/card/apply/credit/1187938_2207.html?EntryLoc2=2739&empSeq=944&btnApp=DP0T1U3"
    }
  ],

  // 집콕냥이 (외출안함)
  "집콕냥이": [
    {
      id: 4,
      name: "하나 원더카드",
      company: "하나카드",
      benefits: "생활요금 10%\n영상스트리밍 40%\n딜리버리 10%\n편의점 10%",
      image: "/images/cards/hana-wonder.png",
      link: "https://m.hanacard.co.kr/MKCDCM1010M.web?CD_PD_SEQ=17499"
    },
    {
      id: 5,
      name: "BC 바로 클리어 플러스",
      company: "BC카드",
      benefits: "배달앱 7%\n편의점 10%\n스트리밍 10%",
      image: "/images/cards/bc-clear-plus.png",
      link: "https://app.paybooc.co.kr/ui/card-mgt/card-mgt/pybc-card/card-dts?cardPdctCd=101922&incnChnlDv=Mobile&affiCd=B009"
    },
    {
      id: 6,
      name: "롯데 LOCA 365",
      company: "롯데카드",
      benefits: "관리비·공과금 10%\n배달앱 10%\n스트리밍 1500원할인",
      image: "/images/cards/lotte-loca365.png",
      link: "https://www.lottecard.co.kr/app/LPBOHAA_V100.lc?bId=93929&vtCdKndC=P14028-A14028"
    }
  ],

  // 칠도그 (여가비 중심)
  "칠도그": [
    {
      id: 7,
      name: "IBK 참!좋은다이소 카드",
      company: "IBK기업카드",
      benefits: "커피 20%할인\nCGV·롯데시네마 4천원 할인\n다이소 컬렉션 앱 30% 청구할인",
      image: "/images/cards/ibk-daiso.png",
      link: "https://cardapplication.ibk.co.kr/card/index.do?card_prdc_id=756299&ad_cd=bspc&mz_cd=IRAINST"
    },
    {
      id: 8,
      name: "삼성 iD ON카드",
      company: "삼성카드",
      benefits: "많이쓰는영역 30%\n커피 30%\n교통 10%",
      image: "/images/cards/samsung-id-on.png",
      link: "https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1731&alncmpC=CYBERBR&affcode=QFBANKTEST04&webViewFirstPage=true"
    },
    {
      id: 9,
      name: "국민 청춘대로 톡톡카드",
      company: "KB국민카드",
      benefits: "스타벅스 50%\n패스트푸드 20%\n간편결제 10%\n대중교통 10%",
      image: "/images/cards/kb-youth.png",
      link: "https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09174"
    }
  ],

  // 호균이 (균형)
  "호균이": [
    {
      id: 10,
      name: "하나 원더카드",
      company: "하나카드",
      benefits: "생활요금 10%\n영상스트리밍 40%\n딜리버리 10%\n편의점 10%",
      image: "/images/cards/hana-wonder.png",
      link: "https://m.hanacard.co.kr/MKCDCM1010M.web?CD_PD_SEQ=17499"
    },
    {
      id: 11,
      name: "삼성 iD MOVE 카드",
      company: "삼성카드",
      benefits: "대중교통 10%\n택시 10%\n커피전문점 10%\n편의점 10%\n스트리밍 10%",
      image: "/images/cards/samsung-id-move.png",
      link: "https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1762&alncmpC=CYBERBR&affcode=QFBANKTEST04&webViewFirstPage=true"
    },
    {
      id: 12,
      name: "국민 청춘대로 톡톡카드",
      company: "KB국민카드",
      benefits: "스타벅스 50%\n패스트푸드 20%\n간편결제 10%\n대중교통 10%",
      image: "/images/cards/kb-youth.png",
      link: "https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09174"
    }
  ],

  // 메새지 (통신비)
  "메새지": [
    {
      id: 13,
      name: "국민 WE:SH All 카드",
      company: "KB국민카드",
      benefits: "쇼핑 멤버십 50%\nOTT 10%\n이동통신 5%",
      image: "/images/cards/kb-wesh-all.png",
      link: "https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09922"
    },
    {
      id: 14,
      name: "삼성 iD MOVE 카드",
      company: "삼성카드",
      benefits: "이동통신 10%\n스트리밍 10%\n편의점 10%",
      image: "/images/cards/samsung-id-move.png",
      link: "https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1762&alncmpC=CYBERBR&affcode=QFBANKTEST04&webViewFirstPage=true"
    },
    {
      id: 15,
      name: "신한 Deep On Platinum+",
      company: "신한카드",
      benefits: "간편결제 20%\n월납 서비스 20%\n편의점 20%",
      image: "/images/cards/shinhan-deep-on.png",
      link: "https://www.shinhancard.com/pconts/html/card/apply/credit/1188280_2207.html?EntryLoc2=2916&empSeq=563&btnApp=DP0T1U3"
    }
  ],

  // 푸드판다 (식비)
  "푸드판다": [
    {
      id: 16,
      name: "BC 바로 클리어 플러스",
      company: "BC카드",
      benefits: "점심식사 7%\n배달앱 7%\n편의점 10%",
      image: "/images/cards/bc-clear-plus.png",
      link: "https://app.paybooc.co.kr/ui/card-mgt/card-mgt/pybc-card/card-dts?cardPdctCd=101922&incnChnlDv=Mobile&affiCd=B009"
    },
    {
      id: 17,
      name: "IBK 참! 좋은 다이소 카드",
      company: "IBK기업카드",
      benefits: "마트 5%\n커피 20%\n편의점 10%",
      image: "/images/cards/ibk-daiso.png",
      link: "https://cardapplication.ibk.co.kr/card/index.do?card_prdc_id=756299&ad_cd=bspc&mz_cd=IRAINST"
    },
    {
      id: 18,
      name: "국민 청춘대로 톡톡카드",
      company: "KB국민카드",
      benefits: "스타벅스 50%\n패스트푸드 20%\n간편결제 10%\n대중교통 10%",
      image: "/images/cards/kb-youth.png",
      link: "https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?cooperationcode=09174&solicitorcode=7030170001&utm_campaign=toktok_card&utm_medium=cpa&utm_source=banksalad"
    }
  ]
};

// 캐릭터명으로 추천 카드 가져오는 함수
export const getRecommendedCards = (characterName) => {
  return cardRecommendations[characterName] || [];
};
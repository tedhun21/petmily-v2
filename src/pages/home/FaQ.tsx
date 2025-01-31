import { useState } from 'react';
import styled from 'styled-components';

import { Column, Divider, Row } from 'styles/commonStyle';
import Collapse from '@components/Collapse';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import BackHeader from '@components/headers/BackHeader';

export default function FaQ() {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const handleClick = (list: string) => {
    setOpen({ ...open, [list]: !open[list] });
  };

  return (
    <Main>
      <BackHeader title="자주 묻는 질문" />
      <Section>
        <div>
          <Question>1. 기본예절</Question>

          <Divider />

          <List>
            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section1-1')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>분리불안과 무는 행동</span>
                </ListTitle>

                {open['section1'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>
              <Collapse open={open['section1-1']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      분리불안은 보호자와의 지나치게 강한 유대감이나 혼자 있는 시간에 대한 두려움에서 비롯될 수
                      있습니다. 이를 해결하기 위해 강아지나 고양이가 혼자 있는 시간에 익숙해지도록 짧은 시간부터 시작해
                      점차 혼자 있는 시간을 늘려가세요. 또한, 보호자가 외출하거나 귀가할 때 과도한 인사를 피하면
                      반려동물의 기대감을 줄이는 데 도움이 됩니다.
                    </p>
                    <p>
                      무는 행동은 강아지나 고양이 모두 스트레스, 호기심, 또는 치아 발달 단계(특히 어린 시기)에서 흔히
                      나타납니다. 이 경우, 물어도 되는 장난감이나 스크래처를 제공하여 대체 행동을 유도하세요. 만약
                      사람이 직접적으로 피해를 받는 경우라면, 차분하고 일관된 방식으로 훈육하고 놀이를 잠시 중단하여
                      잘못된 행동임을 인지시켜 주세요.
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section1-2')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>방문 앞에서 기다리는 반려동물</span>
                </ListTitle>

                {open['section2'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>
              <Collapse open={open['section1-2']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      분리불안일 수 있습니다. 반려동물이 보호자와의 분리로 불안감을 느낄 때, 방문 앞에서 기다리는 행동을
                      보일 수 있습니다. 이를 해결하려면, 하우스 트레이닝과 긍정적인 강화 훈련을 통해 반려동물이 혼자
                      있는 시간을 점차적으로 편안하게 느끼도록 도와주어야 합니다.
                    </p>
                    <p>
                      둘째, 외출이나 활동을 기대하는 행동일 수 있습니다. 특히 강아지의 경우 산책을 기대하는 경우가 많고,
                      고양이도 환경 변화나 놀이 시간이 오기를 기다릴 수 있습니다. 하루 2-3회 규칙적인 산책이나 충분한
                      실내 놀이 시간으로 반려동물이 에너지를 발산할 수 있도록 해주세요.
                    </p>
                    <p>
                      반려동물이 방문 앞에서 기다리는 이유를 이해하고, 그에 맞는 대응을 한다면, 더 편안하고 안정된
                      환경을 제공할 수 있습니다. 😊
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section1-3')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>직접 주는 사료 먹지 않아요</span>
                </ListTitle>

                {open['section1-3'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>
              <Collapse open={open['section1-3']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      보호자가 직접 주는 사료를 먹지 않는 경우, 신뢰 관계 형성과 긍정적인 경험을 쌓는 것이 중요합니다.
                    </p>
                    <p>
                      먼저, 반려동물이 보호자에게 부담감을 느끼지 않도록 접근 방식을 조정하세요. 과도한 스킨십이나
                      강제로 다가가는 행동은 피하고, 반려동물이 스스로 보호자에게 다가올 때까지 기다려 주세요. 특히
                      강아지는 정면 응시를 부담스러워할 수 있으므로 측면에서 부드럽게 바라보는 것이 좋습니다. 고양이의
                      경우도 갑작스러운 움직임이나 억지로 사료를 먹이려는 행동은 스트레스를 유발할 수 있으니 주의가
                      필요합니다.
                    </p>
                    <p>
                      사료를 제공할 때는 자연스럽고 차분한 분위기를 유지하며, 손에 사료를 올려 반려동물이 스스로 다가와
                      먹을 수 있도록 유도하세요. 강아지와 고양이 모두 편안함을 느낄 수 있는 환경에서 짧고 긍정적인
                      경험을 반복하면 신뢰를 쌓는 데 큰 도움이 됩니다.
                    </p>
                    <p>
                      조급한 마음을 갖지 말고, 반려동물이 점차 보호자와의 상호작용에 익숙해질 수 있도록 인내심을 가지고
                      노력해 주세요. 시간이 지나면 신회가 깊어지고, 자연스럽게 사료를 받아먹는 행동으로 이어질 가능성이
                      높습니다. 😊
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>
          </List>
        </div>

        <div>
          <Question>2. 배변</Question>

          <Divider />

          <List>
            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section2-1')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>배변 패드 사용을 제대로 못해요</span>
                </ListTitle>

                {open['section2-1'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section2-1']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      배변 패드를 항상 같은 위치에 두는 것이 중요합니다. 위치가 자주 변경되면 반려동물이 혼란스러워 할
                      수 있으므로, 안정적인 장소에 배변 패드를 두고, 그 자리를 고수하는 것이 좋습니다. 이 위치는
                      반려동물이 자주 가는 곳이나, 배변 패드를 놓고 싶어 하는 곳으로 정하는 것이 좋습니다. 😊
                    </p>
                    <p>
                      배변 패드를 가리도록 유도하려면 간식을 활용하는 방법이 효과적입니다. 간식을 배변 패드 근처에 놓고,
                      반려동물이 자연스럽게 패드에 접근할 수 있도록 유도하세요. 처음에는 간식을 배변 패드 바로 옆에
                      두고, 점차적으로 패드 위로 간식을 이동시키면서 반려동물이 패드 위에 서게 유도합니다.
                    </p>
                    <p>
                      배변 패드에서 배변을 성공적으로 마친 후에는 즉시 칭찬과 보상을 해 주세요. 칭찬은 목소리로
                      해주거나, 간식으로 보상하면 좋습니다. 이렇게 긍정적인 강화를 통해 반려동물이 배변 패드에서
                      배변하는 것이 좋은 일이라는 것을 배우게 됩니다. 🥰
                    </p>
                    <p>
                      배변 패드를 가리도록 훈련하는 과정에서, 반려동물이 배변을 하기 전에 보이는 전조 행동을 잘
                      관찰하세요. 예를 들어, 배변을 하기 직전에 배회하거나, 냄새를 맡는 행동을 보일 수 있습니다. 이러한
                      행동을 포착했을 때, 즉시 배변 패드로 유도해 주세요. 간식을 사용해서 배변 패드로 이끌거나,
                      반려동물이 패드 위에 있을 때 칭찬을 해 주세요.
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section2-2')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>갑자기 아무대나 배변을 해요</span>
                </ListTitle>

                {open['section2-2'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section2-2']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      배변 실수를 하였더라도 반려동물을 혼내지 않는 것이 중요합니다. 실수를 바로잡는 대신, 아이가
                      불안하거나 스트레스를 받지 않도록 유의해야 합니다. 가족 중 다른 사람이 혼을 낸다면, 그로 인해
                      반려동물이 더욱 배변 실수를 할 수 있으므로, 혼내지 않도록 모두가 동일한 접근 방식을 취하는 것이
                      중요합니다. 또한, 혼을 내지 않는 것 외에도 탄식이나 한숨 소리도 내지 않도록 주의해 주세요. 이런
                      소리도 반려동물에게 스트레스를 주고 혼란을 일으킬 수 있습니다.
                    </p>
                    <p>
                      배변 교육을 보다 효과적으로 하려면, 첫 번째로 반려동물이 배변을 하지 않는 곳에서 식사하도록 유도해
                      보세요. 예를 들어, 화장실 발판, 러그, 이불 위에서 음식을 급여하는 것입니다. 반려동물은 자신이
                      쉬거나 음식을 섭취하는 공간에서 배변을 하는 것을 꺼려합니다. 따라서, 배변 실수를 자주 하는 장소가
                      있다면 그곳에서 음식을 주지 않도록 하고, 되도록 사료나 간식은 안정된 장소에서 급여해주세요. 😊
                    </p>
                    <p>
                      둘째, 배변 패드나 배변 장소를 안정적으로 이해시키는 것이 중요합니다. 배변 패드를 가리도록
                      교육하려면 간식을 패드 위에 두기보다는, 간식을 패드 위로 유도하여 반려동물이 자연스럽게 배변
                      패드를 인식하게 하세요. 이때, 반려동물이 패드를 발로 밟을 수 있도록 도와주는 방식이 더
                      효과적입니다. 간식을 패드 위에서 먹게 하는 것은 피하는 것이 좋습니다. 😊
                    </p>
                    <p>
                      마지막으로, 배변을 하기 전의 전조 행동을 파악하고, 이를 통해 반려동물을 배변 패드 방향으로
                      유도하는 것도 좋은 방법입니다. 일관된 훈련을 통해 반려동물이 배변 패드에서 배변을 하도록 돕는 것이
                      중요합니다.
                    </p>
                    <p>
                      배변 교육은 시간이 걸릴 수 있으니, 너무 조급해하지 말고, 반려동물에게 안정감을 주면서 일관된
                      방법으로 훈련을 진행해 주세요. 🥰
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section2-3')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>제가 없을 때만 배변을 해요</span>
                </ListTitle>
                {open['section2-3'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section2-3']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      반려동물이 보호자가 없을 때만 배변하는 행동은 흔히 스트레스와 관련이 깊습니다. 이는 보호자와의
                      분리로 인한 불안이나 환경적 요인에서 비롯될 수 있습니다. 이 문제를 해결하려면 반려동물의 건강
                      상태와 생활 환경을 점검하고, 행동 수정 훈련을 통해 개선하는 것이 중요합니다.
                    </p>
                    <p>
                      먼저, 건강 상태를 확인하는 것이 우선입니다. 반려동물이 갑작스럽게 배변 습관을 바꾼다면 방광염,
                      소화기 질환, 또는 기타 질병일 가능성이 있으므로 동물병원의 진단을 받는 것이 필요합니다. 건강에
                      이상이 없다면, 다음 단계로 행동적 요인을 고려해야 합니다.
                    </p>
                    <p>
                      보호자가 없을 때 반려동물이 불안을 느낀다면, 이는 분리 불안 증세일 수 있습니다. 강아지의 경우
                      보호자 부재 중 긴장하거나 스트레스를 받을 때 배변 실수가 일어날 가능성이 높습니다. 이를 완화하기
                      위해서는 혼자 있는 시간을 점진적으로 늘리는 훈련이 효과적입니다. 예를 들어, 보호자가 짧게 외출하는
                      연습부터 시작해 반려동물이 혼자 있는 시간에 익숙해질 수 있도록 도와줍니다. 이때, 외출 전
                      &quot;다녀올게&quot; 같은 신호를 주는 것이 유용하며, 반려동물이 과도하게 반응하지 않도록
                      자연스럽게 떠나는 것이 중요합니다.
                    </p>

                    <p>
                      고양이의 경우에도 보호자 부재가 스트레스를 유발할 수 있습니다. 새로운 환경이나 화장실의 위치 변경,
                      혹은 보호자의 갑작스러운 부재 등이 고양이에게 긴장감을 줄 수 있습니다. 이럴 때는 집 안에 충분한
                      화장실을 배치하고, 화장실의 위치를 조용한 곳으로 설정해 안정감을 제공해야 합니다.
                    </p>

                    <p>
                      환경의 개선도 중요합니다. 배변 실수가 잦은 장소를 철저히 청소해 냄새를 제거하고, 강아지에게는 배변
                      패드를 추가로 제공하거나 고양이에게는 모래 화장실을 늘려 선택지를 제공하면 실수를 줄일 수
                      있습니다. 특히, 보호자 부재 시 특별한 간식이나 장난감을 제공하여 그 시간이 즐거운 경험으로
                      느껴지게 해주는 것도 도움이 됩니다.
                    </p>

                    <p>
                      이와 함께 반려동물의 에너지를 충분히 발산시키는 것도 중요합니다. 강아지의 경우 외출 전에 산책을
                      통해 체력을 소모시키고, 고양이에게는 사냥 놀이 등을 통해 스트레스를 해소하도록 도와줍니다. 이렇게
                      하면 반려동물이 보호자 부재 중에도 비교적 안정적으로 시간을 보낼 수 있습니다.
                    </p>

                    <p>
                      시간이 걸리더라도 꾸준히 반려동물의 스트레스 요인을 파악하고, 적절히 대응한다면 문제 행동을 개선할
                      수 있을 것입니다. 반려동물이 더 편안하고 행복하게 생활할 수 있도록 작은 변화부터 실천해 보세요. 😊
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>
          </List>
        </div>

        <div>
          <Question>3. 산책</Question>
          <Divider />

          <List>
            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section3-1')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>산책 때 다른 강아지를 보고 짖어요</span>
                </ListTitle>

                {open['section3-1'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section3-1']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      산책 중에 다른 강아지나 고양이를 보고 짖는 경우, 반려동물마다 이유가 조금씩 다를 수 있지만,
                      대부분은 낯선 환경에 대한 경계심이나 흥분 상태 때문이에요. 이럴 때 중요한 건 강압적으로 제지하려고
                      하기보다는 보호자가 침착하게 대처하고, 긍정적인 경험을 쌓게 도와주는 거랍니다.
                    </p>
                    <p>
                      먼저, 반려동물이 다른 동물에게 짖는 상황에서는 크게 반응하지 않는 게 좋아요. &quot;괜찮아&quot;,
                      &quot;안 돼&quot;, &quot;조용히 해&quot; 같은 말을 하거나 목줄을 당기면 오히려 상황을 더 자극할 수
                      있거든요. 차라리 줄을 짧게 잡고 가만히 기다려주세요. 짖는 대상에서 천천히 시선을 돌리거나, 반대
                      방향으로 살짝 움직여서 반려동물이 자연스럽게 흥미를 잃도록 유도하는 것도 방법이에요.
                    </p>
                    <p>
                      지금은 다른 동물과 직접적인 접촉보다는 멀리서 관찰하거나, 지나간 곳의 냄새를 맡게 하는 정도로
                      천천히 적응시키는 게 좋아요. 특히, 성격이 차분하고 무던한 상대를 만나는 게 중요해요. 반려동물이
                      처음부터 모든 동물과 잘 어울릴 필요는 없으니까, 작은 성공 경험부터 쌓아나가는 게 가장
                      효과적이에요.
                    </p>
                    <p>
                      또한, 보호자와의 상호작용을 강화하는 것도 중요해요. 반려동물이 지나가는 사람이나 동물보다 보호자의
                      신호에 더 집중하게 만드는 연습이 필요하죠. 입술로 마찰음을 내거나, 이름을 짧게 불러서 주의를 끈
                      다음 간식이나 장난감으로 보상을 주세요. 이런 훈련은 산책 전에 실내에서 먼저 해보면 더 효과적일
                      거예요.
                    </p>
                    <p>
                      사람과의 교감도 자연스럽게 만들어줄 수 있어요. 예를 들어, 반려동물이 &quot;앉아&quot; 같은 간단한
                      명령을 잘 이해하고 있다면, 지나가는 사람에게 간식을 부탁해서 그 사람이 &quot;앉아&quot;라고 말한
                      뒤 간식을 살짝 던져주게 하면 좋습니다. 이런 과정을 반복하다 보면, 낯선 사람과의 만남도 점점
                      긍정적으로 받아들일 거예요.
                    </p>
                    <p>
                      무엇보다, 목줄을 당기거나 강압적으로 훈육하지 않도록 주의해주세요. 이런 방식은 오히려 반려동물에게
                      부정적인 감정을 남길 수 있거든요. 반려동물마다 적응 속도는 다르니, 여유를 가지고 꾸준히
                      연습해보세요. 작은 변화들이 쌓이면, 산책이 훨씬 더 즐거워질 거예요. 😊
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section3-2')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>산책 때 낑낑거림</span>
                </ListTitle>

                {open['section3-2'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section3-2']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      반려동물이 산책을 무서워하거나 긴장하는 경우, 그 원인을 천천히 해결해나가는 것이 중요해요. 특히,
                      산책을 두려워하는 경우 몇 가지 방법으로 점진적으로 교육을 시킬 수 있습니다.
                    </p>
                    <p>
                      첫 번째로, 반려동물의 애정도를 줄여주는 것이 도움이 될 수 있어요. 너무 자주 쓰다듬거나 눈을 맞추고
                      안아주는 행동은 반려동물이 보호자에게 의존하게 만들 수 있거든요. 그래서 그런 행동을 조금 줄여서
                      반려동물이 독립적으로 행동할 수 있도록 도와주는 게 좋습니다. 예를 들어, 반려동물이 다가와도 손이나
                      팔로 부드럽게 밀어내고, 침대나 소파에 올라오는 것을 거절하는 연습을 해보세요.
                    </p>
                    <p>
                      두 번째로, 산책 줄을 착용하는 것에 대한 긍정적인 연관을 만들어주는 방법이에요. 산책을 두려워하는
                      경우, 산책 줄을 보기만 해도 긴장하는 반려동물들이 많아요. 이럴 때는 산책 줄을 착용한 후 좋은 일이
                      일어나도록 연결시켜주세요. 예를 들어, 산책 줄을 착용한 직후에 간식이나 사료를 주거나, 산책이
                      끝나면 산책 줄을 벗겨주면서 보상하는 방식으로 산책 줄에 대한 불안을 줄여나갈 수 있어요.
                    </p>
                    <p>
                      세 번째로는, 집안에서 짧은 산책을 시작해보세요. 집 안에서 산책 줄을 착용하고 가볍게 걸어보거나,
                      현관문을 열고 잠깐 나갔다가 다시 들어오는 연습을 해볼 수 있어요. 이렇게 점차적으로 산책의 거리를
                      늘리거나, 외부에서 앉아 쉬는 시간을 주면서 반려동물이 산책에 대한 두려움을 점차 없앨 수 있습니다.
                    </p>
                    <p>
                      마지막으로, 사회화 시기가 끝나지 않은 반려동물은 조급하게 교육을 진행하기보다는 천천히 꾸준히
                      진행하는 것이 중요해요. 차근차근 교육을 진행하면서 반려동물이 산책을 즐길 수 있도록 도와주세요! 😊
                    </p>
                    <p></p>
                    <p></p>
                    <p></p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section3-3')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>야외에서만 분리불안에 있는거 같아요</span>
                </ListTitle>

                {open['section3-3'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section3-3']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      반려동물이 야외에서만 분리불안을 보이는 경우, 천천히 꾸준히 교육을 진행하는 것이 중요합니다. 아래
                      내용을 참고해서 차근차근 연습해 보세요.
                    </p>
                    <p>
                      먼저, 실내에서 기다려 연습을 시작해 주세요. 야외에서만 분리불안을 보이더라도,
                      &quot;기다려&quot;라는 명령어를 완벽히 이해하고 잘 따를 줄 아는 것이 중요해요. 집 안에서
                      &quot;기다려&quot;를 연습하며 보호자가 최소 10m 이상 떨어져도 반려동물이 스스로 안정적으로 기다릴
                      수 있도록 연습해주세요.
                    </p>
                    <p>
                      그다음, 야외에서 기다려 연습을 진행할 차례예요. 산책 중에 나무나 기둥에 산책줄을 묶어두고(줄이
                      풀리지 않도록 주의!) &quot;기다려&quot;를 연습하세요. 이때, 거리를 한 번에 너무 많이 늘리지 말고
                      천천히 10cm씩 조금씩 늘리면서 진행해야 합니다. 연습이 끝난 후 반려동물에게 돌아가면 간식으로
                      보상을 해주는 것도 잊지 마세요.
                    </p>
                    <p>
                      또한, 노즈워크를 활용한 연습도 좋은 방법이에요. 집 안에서 노즈워크를 제공할 때
                      &quot;기다려&quot;를 한 뒤 간식을 찾아 먹는 연습을 반복해 보세요. &quot;찾아!&quot;라는 신호를
                      사용하여 노즈워크와 기다려 훈련을 연결하면, 이를 야외에서도 자연스럽게 적용할 수 있어요.
                      야외에서는 바닥에 이물질이 없는 안전한 곳에서 간식을 뿌려 노즈워크를 진행해 주세요.
                    </p>
                    <p>
                      마지막으로, 분리 신호를 알려주는 습관을 들여보세요. 반려동물이 분리 상황을 인지하면 불안해하기
                      쉽기 때문에, 갑자기 멀어지거나 뛰어가는 행동은 피해야 해요. 집에서 화장실을 갈 때처럼
                      &quot;다녀올게&quot; 등의 분리 신호를 반복적으로 알려주면서, 반려동물이 분리를 자연스럽게 받아들일
                      수 있도록 도와주세요. 이 습관을 야외에서도 적용하면 더 큰 효과를 볼 수 있습니다.
                    </p>
                    <p>
                      분리불안 교육은 조급해하지 않고 차근차근 진행하는 것이 가장 중요해요. 어려운 점이나 궁금한 부분이
                      생기면 언제든지 질문해 주세요. 베리와 행복하고 건강한 반려 생활 이어가시길 바랍니다! 😊
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>
          </List>
        </div>

        <div>
          <Question>4. 공격성</Question>

          <Divider />

          <List>
            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section4-1')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>입질</span>
                </ListTitle>

                {open['section4-1'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section4-1']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      입질은 반려동물을 키우면서 보호자들이 자주 겪는 문제 중 하나입니다. 특히 강아지와 고양이는 각각의
                      특성과 본능에 따라 다른 이유로 입질을 하게 됩니다. 입질 문제를 해결하기 위해서는 반려동물의 행동
                      원인을 이해하고, 적절한 환경을 조성하며, 일관성 있는 교육을 실천하는 것이 중요합니다.
                    </p>
                    <p>
                      입질의 원인을 이해하는 것이 첫걸음입니다. 강아지는 주로 놀이 본능, 주의를 끌기 위한 행동, 스트레스
                      해소, 또는 에너지 과잉으로 입질을 합니다. 특히 어릴 때는 치아가 나면서 가려움 때문에 물고 싶은
                      충동이 강해지기도 합니다. 반면, 고양이는 사냥 본능, 놀이 도중의 흥분, 과도한 자극(예: 쓰다듬는
                      시간이 길어진 경우), 또는 스트레스 때문에 입질을 할 수 있습니다. 이처럼 입질 행동의 원인은
                      강아지와 고양이 각각 다를 수 있으므로 보호자는 반려동물이 왜 입질을 하는지 관찰하고 파악해야
                      합니다.
                    </p>
                    <p>
                      입질을 예방하거나 완화하려면 보호자가 일관된 태도를 유지하는 것이 중요합니다. 입질했을 때 웃거나
                      장난처럼 받아들이는 행동은 반려동물에게 혼란을 줄 수 있습니다. 가끔은 허용하고, 가끔은 혼내는
                      방식은 &quot;이 상황에서는 물어도 되는구나&quot;라는 잘못된 학습을 초래할 수 있기 때문입니다.
                      따라서 손이나 발을 물었을 때는 일관성 있게 &quot;하지 않아야 하는 행동&quot;이라는 메시지를
                      전달해야 합니다. 특히, 반려동물이 입질했을 때 간식을 주거나 놀아주는 등의 반응은 입질 행동을
                      강화하는 결과를 초래할 수 있으니 주의가 필요합니다.
                    </p>
                    <p>
                      입질을 막기 위한 구체적인 대처 방법도 다릅니다. 강아지의 경우, 손이나 발을 물었을 때는 즉각
                      반응하지 않고 자리를 피하거나 관심을 끄는 방식이 효과적입니다. 꾸짖거나 화내는 것은 오히려
                      반려견의 흥분을 높이거나 공격성을 키울 수 있으니, 물리적 대처보다는 차분한 태도를 유지하세요.
                      또한, 입질 행동을 멈췄을 때 칭찬하거나 간식으로 보상하여 &quot;이 행동은 좋다&quot;는 메시지를
                      전달하면 긍정적인 학습이 이루어질 수 있습니다. 한편, 고양이는 놀이 중 입질을 할 때가 많은데,
                      이때는 손이나 발을 사냥감으로 여기지 않도록 장난감을 사용해 노는 것이 중요합니다. 낚싯대형
                      장난감처럼 보호자와의 적당한 거리를 유지할 수 있는 놀이 도구가 효과적입니다. 또한, 고양이가 싫증을
                      느껴 꼬리를 흔들거나 귀를 뒤로 젖히는 신호를 보일 경우, 놀이를 멈추고 쉬게 해주는 것이 필요합니다.
                    </p>
                    <p>
                      입질을 예방하려면 반려동물의 입질 욕구를 다른 방식으로 해소하는 환경을 만들어야 합니다.
                      강아지에게는 &quot;우드스틱&quot;같은 물어도 되는 장난감을 제공할 수 있습니다. 다만, 장난감을 항상
                      방치해두기보다는 보호자가 아이를 돌볼 수 없을 때나 혼자 놀 시간이 필요할 때 제공하는 것이
                      좋습니다. 장난감에 대한 흥미를 유지하려면, 평소에는 장난감을 치워두는 것도 하나의 방법입니다.
                      고양이는 사냥 본능을 해소할 수 있는 다양한 장난감을 활용해 에너지를 발산시킬 수 있습니다. 캣타워,
                      숨을 수 있는 공간, 또는 간식을 숨겨두는 노즈워크형 놀이도 고양이의 흥미를 자극할 수 있습니다.
                    </p>
                    <p>
                      반려동물과의 신뢰 관계를 강화하는 것도 중요합니다. 강아지의 경우, 보호자의 긍정적인 반응(칭찬,
                      간식 등)을 통해 &quot;입질하지 않는 행동&quot;을 강화하고, 꾸준히 산책과 놀이를 제공하여 에너지를
                      소진시키세요. 흥분도가 높은 터그 놀이보다는 노즈워크나 간식을 찾는 놀이처럼 차분한 활동을 통해
                      긴장을 완화시키는 것이 도움이 됩니다. 고양이는 자율성을 중시하는 동물이므로 억지로 스킨십을
                      강요하기보다는, 고양이가 스스로 다가올 때 보호자가 반응을 보여주는 방식이 효과적입니다. 쓰다듬거나
                      놀아주는 시간도 고양이의 기분과 신호를 읽으며 조율하는 것이 중요합니다.
                    </p>
                    <p>
                      입질 문제는 단시간에 해결되지 않을 수 있습니다. 그러나 반려동물의 행동을 꾸준히 관찰하고, 위와
                      같은 방법을 실천하면 점차 개선될 가능성이 높습니다. 반려동물과 함께 더 즐겁고 조화로운 반려 생활을
                      만들어가시기를 바랍니다. 😊
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section4-2')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>스킨십하면 짖어요</span>
                </ListTitle>

                {open['section4-2'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section4-2']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      반려동물이 스킨십을 거부하거나 짖는 경우, 이는 단순한 행동 문제가 아니라 그들의 생활 환경과
                      보호자와의 상호작용 방식에서 비롯될 가능성이 큽니다. 강아지와 고양이는 서로 다른 성격과 표현
                      방식을 가지고 있기 때문에, 이 두 동물의 특성을 이해하고 이를 존중하는 태도가 중요합니다.
                    </p>
                    <p>
                      먼저, 강아지의 경우 짖는 행동은 불편함을 표현하거나 과도한 흥분 상태에서 나타날 수 있습니다.
                      강아지가 이런 반응을 보일 때에는 보호자가 아이를 달래려고 하는 대신, 차분하게 강아지가 스스로
                      흥분을 가라앉히도록 기다려주는 것이 좋습니다. 예를 들어, 강아지가 긴장을 풀고 차분해질 때까지
                      보호자가 아무런 행동을 하지 않고 조용히 기다린다면, 강아지는 스스로 안정감을 찾을 수 있습니다.
                      이는 강아지가 &quot;짖음이 더 이상 보호자의 주목을 끌지 못한다&quot;는 것을 학습하게 돕습니다.
                    </p>
                    <p>
                      한편, 고양이의 경우 스킨십을 싫어하거나 하악질 같은 불편함의 신호를 보일 때, 억지로 다가가거나
                      만지려고 하는 행동을 피해야 합니다. 고양이는 스스로 다가올 때 편안함을 느끼는 경우가 많으므로,
                      보호자가 기다려 주는 것이 중요합니다. 고양이가 다가올 때 부드럽게 쓰다듬거나 칭찬을 통해 긍정적인
                      경험을 제공하면, 점차 스킨십에 익숙해질 수 있습니다.
                    </p>
                    <p>
                      또한 보호자가 반려동물과의 상호작용에서 일관성을 유지하는 것이 중요합니다. 강아지에게 손을 물거나
                      짖는 행동을 보였을 때 무조건적인 주의를 주는 대신, 보호자가 자리를 피하거나 관심을 끊어줌으로써
                      이런 행동이 원하는 결과를 가져오지 못한다는 것을 알려줘야 합니다. 고양이에게도 비슷하게, 불편한
                      행동을 보일 때 억지로 잡으려 하지 말고 스스로 진정할 시간을 주는 것이 좋습니다.
                    </p>
                    <p>
                      이와 함께, 긍정적인 경험을 통해 학습을 강화하는 것도 중요합니다. 강아지가 차분하게 행동할 때
                      칭찬하거나 간식을 제공하여 그 행동을 강화할 수 있고, 고양이가 편안하게 다가올 때 부드러운 칭찬과
                      간식을 주면 스킨십에 대한 거부감이 줄어들 수 있습니다.
                    </p>
                    <p>
                      마지막으로, 반려동물의 스트레스를 줄이고 건강한 생활을 돕기 위해 활동적인 시간을 늘려주는 것이
                      필요합니다. 강아지는 산책이나 놀이를 통해 에너지를 발산하고, 고양이는 장난감과 놀이 시간을 통해
                      정신적 자극을 받을 수 있도록 해야 합니다. 만약 이러한 방법을 시도해도 개선이 어렵다면, 반려동물
                      행동 전문가나 수의사와 상담하여 더 구체적인 솔루션을 찾아보는 것도 좋은 방법입니다.
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section4-3')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>짖음이 심해요</span>
                </ListTitle>

                {open['section4-3'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section4-3']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      반려동물이 짖음이 심할 경우, 먼저 혼을 내지 않도록 주의해야 합니다. 혼을 내면 보호자와의 관계가
                      악화될 수 있을 뿐 아니라, 외부 소음에 대한 경계심이 더 강해질 가능성이 있습니다. 또한, 짖음을
                      멈추게 하려고 아이를 안아주거나 달래는 행동도 피해야 합니다. 이런 행동은 오히려 아이가 짖으면
                      관심을 받을 수 있다고 잘못 학습하게 만들 수 있습니다.
                    </p>
                    <p>
                      짖음 문제를 해결하려면 다양한 원인을 살펴보는 것이 중요합니다. 건강 상태, 식습관, 평소 생활 습관
                      등을 점검하고, 외부 소음에 익숙해질 수 있도록 환경을 만들어주는 것이 도움이 됩니다. 예를 들어,
                      현관문이나 창문 앞에서 아이와 함께 조용히 앉아 시간을 보내는 경험을 자주 제공하면, 외부 소음에
                      대한 민감도를 낮출 수 있습니다.
                    </p>
                    <p>
                      보호자와의 관계 개선도 중요한 부분입니다. 반려동물이 보호자를 자신이 지켜야 할 대상으로 인식하면
                      스스로 더 큰 부담을 느끼게 됩니다. 따라서 지나치게 말을 걸거나 안아주는 등의 행동을 줄이고, 아이가
                      안정감을 느낄 수 있는 독립적인 공간을 마련해주는 것이 필요합니다. 켄넬이나 하우스 같은 공간을
                      활용해 아이가 스스로 차분해질 시간을 가질 수 있도록 해주세요.
                    </p>
                    <p>
                      규칙적인 생활도 아이의 짖음을 줄이는 데 큰 도움이 됩니다. 하루에 최소 한 번 이상 산책을 통해
                      에너지를 발산시키고, 터그 놀이나 노즈워크 같은 실내 활동으로 스트레스를 해소할 기회를
                      만들어주세요. 이러한 생활 습관은 반려동물의 문제 행동을 예방하고 개선하는 데 큰 역할을 합니다.
                    </p>
                    <p>
                      다른 반려동물과의 사회화는 천천히 진행하는 것이 중요합니다. 애견 카페나 운동장은 다양한 반려동물을
                      만날 기회를 제공할 수 있지만, 아이에게는 부담스러운 환경이 될 수 있습니다. 대신 성격이 온화하고
                      안정적인 성견과 함께 산책하거나, 멀리서 간격을 두고 다른 반려동물과 접촉하는 경험을 통해 조금씩
                      적응하도록 도와주세요.
                    </p>
                    <p>
                      이 모든 과정을 진행해도 문제가 해결되지 않는다면, 전문가와 상담해 정확한 원인을 분석하고 도움을
                      받는 것이 좋습니다. 반려동물과 보호자 모두가 더 행복한 시간을 보낼 수 있기를 바랍니다.
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section4-4')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>특정인이 있을 때만 짖어요</span>
                </ListTitle>

                {open['section4-4'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section4-4']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      특정인에 대해 강한 애착을 보이며 짖는 경우, 먼저 아이와의 스킨십을 최소화하는 것이 중요합니다.
                      함께 잠자리에 들거나, 무릎에 올려두고 안아주는 행동, 말을 거는 등의 습관은 아이의 애착을 더욱
                      강화할 수 있으므로 피해야 합니다. 특히, 아이가 쇼파나 침대 위에서 보호자와 함께 머무르지 않도록
                      하고, 독립적인 공간을 마련해주는 것이 필요합니다.
                    </p>
                    <p>
                      켄넬이나 쿠션, 방석과 같은 독립 공간은 현관을 마주하지 않으면서 사람의 동선과 겹치지 않는 조용한
                      곳에 배치하는 것이 좋습니다. 만약 아이가 안아 달라고 앞발로 매달리거나 쇼파, 침대에 올라오려고 할
                      경우, 손이 아닌 팔꿈치나 다리를 사용해 부드럽게 밀어내어 거절해주세요. 이때 눈을 마주치지 않는
                      것도 중요한 점입니다. 손으로 밀어내는 행동은 스킨십으로 받아들여질 수 있으니 주의가 필요합니다.
                    </p>
                    <p>
                      이러한 방식을 모든 가족 구성원이 함께 실천하는 것이 중요합니다. 특정 구성원과 새로운 애착이
                      형성되지 않도록 하기 위해서라도, 기본적인 규칙을 일관되게 지켜야 합니다. 또한 산책, 개인기 교육,
                      켄넬 훈련과 같은 활동을 통해 아이가 독립적인 성향을 가지도록 도와주세요. 장난감은 집안에 방치하지
                      말고, 아이가 혼자 남겨졌을 때나 잠자리에 들었을 때처럼 보호자가 케어할 수 없는 상황에만 제공하고,
                      나머지 시간에는 치워두는 것이 좋습니다.
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>

            <Item>
              <ListItemButton type="button" onClick={() => handleClick('section4-5')}>
                <ListTitle>
                  <span>Q.</span>
                  <span>중성화 후 계속 되는 짖음</span>
                </ListTitle>

                {open['section4-5'] ? <FaAngleUp /> : <FaAngleDown />}
              </ListItemButton>

              <Collapse open={open['section4-5']} timeout="auto" unmountOnExit>
                <Answer>
                  <img src="/favicon.ico" alt="logo" />
                  <ParagraphWrapper>
                    <p>
                      중성화 수술 후 아이가 짖음을 멈추지 않는 경우, 수술 후의 심리적 불안정과 스트레스가 원인일 수
                      있습니다. 수술 후 아이들은 몸의 불편함과 심리적 불안정을 겪을 수 있으니, 보호자님께서 충분한
                      이해와 인내심을 가지고 안정적인 환경을 만들어주는 것이 중요합니다.
                    </p>
                    <p>
                      중성화 수술 후 아이가 짖음을 멈추지 않는 경우, 수술 후의 심리적 불안정과 스트레스가 원인일 수
                      있습니다. 수술 후 아이들은 몸의 불편함과 심리적 불안정을 겪을 수 있으니, 보호자님께서 충분한
                      이해와 인내심을 가지고 안정적인 환경을 만들어주는 것이 중요합니다. 넥카라는 수술 부위를
                      그루밍하면서 생길 수 있는 2차 감염을 예방하기 위해 꼭 착용해야 하는 도구입니다. 안쓰럽게
                      느껴지더라도 아이의 회복을 위해 반드시 필요하니 착용을 유지해주세요. 수술 후 최소 1주일 정도는
                      안정적인 환경에서 충분히 쉬게 하고, 완치 후에는 정상적인 일상으로 돌아갈 수 있도록 점차 활동을
                      늘려주세요.
                    </p>
                    <p>
                      아이의 스트레스를 해소하기 위해 좋아하는 장난감이나 캣닢, 마따따비 등을 활용하여 놀아주는 것이
                      좋습니다. 또한, 화장실을 덮개가 없는 오픈형 화장실로 바꿔 아이가 이용하기 편하도록 환경을
                      조정해주는 것도 도움이 됩니다.
                    </p>
                    <p>
                      수술 후의 불편함이 서서히 사라지며 아이가 점차 안정을 찾을 것입니다. 진행하면서 어려움이 있거나
                      추가적인 조언이 필요하면 편하게 질문 남겨주세요. 아이와 함께 건강하고 행복한 시간을 보내시길
                      바랍니다!
                    </p>
                  </ParagraphWrapper>
                </Answer>
              </Collapse>
            </Item>
          </List>
        </div>
      </Section>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Section = styled.section`
  flex: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
`;

const Question = styled.h1`
  color: ${({ theme }) => theme.text.highlight};
  padding: 8px;
  ${({ theme }) => theme.fontSize.s18h27};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.li``;

const ListItemButton = styled.button`
  width: 100%;
  display: flex;

  padding: 8px;
  justify-content: space-between;
  align-items: center;

  hover: {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }
`;

const ListTitle = styled.div`
  display: flex;
  gap: 8px;
  ${({ theme }) => theme.fontSize.s16h24};

  span:first-child {
    color: ${({ theme }) => theme.text.highlight};
  }

  span:second-child {
  }
`;

const Answer = styled(Row)`
  gap: 8px;
  padding-left: 8px;

  img {
    width: 16px;
    height: 16px;
  }
`;

const ParagraphWrapper = styled(Column)`
  gap: 8px;
  color: ${({ theme }) => theme.text.secondary};
  ${({ theme }) => theme.fontSize.s14h21};

  p {
    text-indent: 4px;
  }
`;

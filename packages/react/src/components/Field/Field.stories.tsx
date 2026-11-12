import { textStyles, vars } from "@d5ng/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleHelp } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Field, type FieldControlProps } from "./Field";

type StoryInputProps = ComponentProps<"input">;

// TextField가 나오기 전까지 스토리에서만 쓰는 입력이에요. Figma Text Input 기본 크기를 흉내 내요.
function StoryInput({ style, ...inputProps }: StoryInputProps) {
  const { disabled } = inputProps;
  const invalid = inputProps["aria-invalid"] === true;

  return (
    <input
      {...inputProps}
      style={{
        ...textStyles.bodyDefault,
        boxSizing: "border-box",
        width: "100%",
        // Text Input medium 높이예요. 입력 전용 토큰은 TextField에서 정해요.
        minHeight: "48px",
        paddingInline: vars.spacing[16],
        border: `1px solid ${invalid ? vars.color.stroke.critical : vars.color.stroke.neutralWeak}`,
        borderRadius: vars.radius.lg,
        background: disabled
          ? vars.color.bg.disabled
          : vars.color.bg.layerDefault,
        color: disabled ? vars.color.fg.disabled : vars.color.fg.neutral,
        ...style,
      }}
    />
  );
}

const renderInput = (control: FieldControlProps) => <StoryInput {...control} />;

const deliveryOptions = ["문 앞", "경비실", "택배함"];

// RadioGroup이 나오기 전까지 스토리에서만 쓰는 묶음이에요. div엔 required·disabled가 없어서 aria로 바꿔요.
function StoryRadioGroup({
  required,
  disabled,
  ...groupProps
}: FieldControlProps) {
  return (
    <div
      role="radiogroup"
      aria-required={required || undefined}
      aria-disabled={disabled || undefined}
      {...groupProps}
      style={{ display: "flex", flexDirection: "column", gap: vars.spacing[8] }}
    >
      {deliveryOptions.map((option) => (
        <label
          key={option}
          style={{
            ...textStyles.bodyDefault,
            display: "flex",
            gap: vars.spacing[8],
            color: vars.color.fg.neutral,
          }}
        >
          <input
            type="radio"
            name={groupProps.id}
            value={option}
            disabled={disabled}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  args: { label: "이름", children: renderInput },
  argTypes: {
    label: { control: "text" },
    labelWeight: { control: "inline-radio", options: ["medium", "semibold"] },
    description: { control: "text" },
    errorMessage: { control: "text" },
    characterCount: { control: "object" },
    headerAction: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      // Figma 예시 폭이에요. 부모 너비를 꽉 채우는 모습을 좁은 폭에서 봐요.
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=210-13981",
    },
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
} as const;

/** 가장 흔한 쓰임이에요. 라벨이 입력의 이름이 돼요. */
export const Default: Story = {};

/** 무엇을 어떻게 적을지 미리 알려 줄 때 써요. 입력의 설명으로 읽혀요. */
export const Description: Story = {
  args: { description: "가족관계증명서에 적힌 이름으로 써 주세요." },
};

/** 표의 열 제목처럼 주변이 이름을 보여 줄 때만 숨겨요. 스크린리더는 그대로 읽어요. */
export const HideLabel: Story = {
  args: { label: "검색어", hideLabel: true },
};

/** 라디오 묶음처럼 입력 여러 개에 라벨 하나를 붙일 때 켜요. 라벨이 묶음의 이름이 돼요. */
export const Group: Story = {
  args: {
    label: "받는 방법",
    group: true,
    description: "택배 기사님께 전해 드려요.",
    children: (control) => <StoryRadioGroup {...control} />,
  },
};

/** 라벨을 더 눈에 띄게 할 때 semibold를 써요. */
export const LabelWeight: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Field {...args} labelWeight="medium" />
      <Field {...args} labelWeight="semibold" />
    </div>
  ),
};

/** 위는 필수 항목만, 아래는 선택 항목만 표시해요. 한 폼에서는 한쪽만 골라요. */
export const RequirementIndicator: Story = {
  render: (args) => (
    <div style={{ ...stackStyle, gap: 48 }}>
      <div style={stackStyle}>
        <Field {...args} label="이름" required requirementIndicator />
        <Field {...args} label="별명" />
      </div>
      <div style={stackStyle}>
        <Field {...args} label="이름" required />
        <Field {...args} label="별명" requirementIndicator />
      </div>
    </div>
  ),
};

/** 입력을 돕는 동작 하나를 라벨 옆에 둬요. ghost small 버튼만 써요. */
export const HeaderAction: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Field
        {...args}
        headerAction={
          <IconButton
            variant="ghost"
            size="small"
            aria-label="이름 입력 도움말"
          >
            <CircleHelp />
          </IconButton>
        }
      />
      <Field
        {...args}
        label="주소"
        headerAction={
          <Button variant="ghost" size="small">
            주소 찾기
          </Button>
        }
      />
    </div>
  ),
};

/** 값이 올바르지 않을 때예요. 오류 문구가 안내 자리를 대신해요. */
export const Invalid: Story = {
  args: {
    invalid: true,
    description: "가족관계증명서에 적힌 이름으로 써 주세요.",
    errorMessage: "이름을 입력해 주세요.",
  },
};

/** 안내·오류를 더 눈에 띄게 할 때 아이콘을 붙여요. */
export const MessageIcon: Story = {
  args: { showMessageIcon: true },
  render: (args) => (
    <div style={stackStyle}>
      <Field
        {...args}
        description="가족관계증명서에 적힌 이름으로 써 주세요."
      />
      <Field {...args} invalid errorMessage="이름을 입력해 주세요." />
    </div>
  ),
};

const shortName = "홍길동";
// 30자를 넘는 값이에요(33자).
const longName = "아주 길게 적어서 서른 글자 제한을 넘긴 이름이에요 정말로요";

/** 길이 제한이 있을 때 보여 줘요. 넘쳤을 때 오류로 볼지는 쓰는 쪽이 정해요. */
export const CharacterCount: Story = {
  render: (args) => (
    <div style={stackStyle}>
      <Field {...args} characterCount={{ current: 0, max: 30 }} />
      <Field {...args} characterCount={{ current: shortName.length, max: 30 }}>
        {(control) => <StoryInput {...control} defaultValue={shortName} />}
      </Field>
      <Field
        {...args}
        invalid
        errorMessage="30자 이내로 써 주세요."
        characterCount={{ current: longName.length, max: 30 }}
      >
        {(control) => <StoryInput {...control} defaultValue={longName} />}
      </Field>
    </div>
  ),
};

/** 지금은 입력할 수 없어요. 보조 액션도 따로 막아요. */
export const Disabled: Story = {
  args: {
    disabled: true,
    description: "가족관계증명서에 적힌 이름으로 써 주세요.",
    characterCount: { current: 0, max: 30 },
    headerAction: (
      <IconButton
        variant="ghost"
        size="small"
        aria-label="이름 입력 도움말"
        disabled
      >
        <CircleHelp />
      </IconButton>
    ),
  },
  parameters: {
    // 비활성 색은 대비 기준(WCAG 1.4.3)에서 빠지는 게 맞아서 대비 검사를 꺼요.
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

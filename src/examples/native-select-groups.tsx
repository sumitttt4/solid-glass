import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

export default function NativeSelectGroups() {
  return (
    <NativeSelect>
      <NativeSelectOption value="">Select department</NativeSelectOption>
      <NativeSelectOptGroup label="Engineering">
        <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
        <NativeSelectOption value="backend">Backend</NativeSelectOption>
        <NativeSelectOption value="devops">DevOps</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Sales">
        <NativeSelectOption value="sales-rep">Sales rep</NativeSelectOption>
        <NativeSelectOption value="account-manager">
          Account manager
        </NativeSelectOption>
        <NativeSelectOption value="sales-director">
          Sales director
        </NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Operations">
        <NativeSelectOption value="support">
          Customer support
        </NativeSelectOption>
        <NativeSelectOption value="product-manager">
          Product manager
        </NativeSelectOption>
        <NativeSelectOption value="ops-manager">
          Operations manager
        </NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  )
}

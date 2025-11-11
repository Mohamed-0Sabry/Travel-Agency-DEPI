import Button from "@/Components/ui/Button";
import Text from "@/Components/ui/Text";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    <div className="flex flex-wrap gap-4 items-center">{children}</div>
  </div>
);

const TestComponentsPage = () => {
  return (
    <div className="p-10 space-y-10 bg-gray-50 min-h-screen">
      <Text type="Header" size="2xl" className="mb-2">
        🧱 UI Component Showcase
      </Text>
      <Text type="Paragraph" className="text-gray-600">
        A quick visual test page for buttons and text components.
      </Text>

      {/* Buttons Section */}
      <div className="space-y-8">
        <Text type="SubHeader" size="xl" className="border-b pb-2">
          Buttons
        </Text>

        <Section title="Variants">
          <Button variant="primary" onClick={() => alert("Primary Clicked!")}>
            Primary
          </Button>
          <Button variant="secondary" onClick={() => alert("Secondary Clicked!")}>
            Secondary
          </Button>
          <Button variant="clear" onClick={() => alert("Clear Clicked!")}>
            Clear
          </Button>
        </Section>

        <Section title="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Section>

        <Section title="Loading & Disabled">
          <Button isLoading>Loading...</Button>
          <Button disabled>Disabled</Button>
        </Section>

        <Section title="With Icons">
          <Button leftIcon={<span>🔥</span>}>Left Icon</Button>
          <Button rightIcon={<span>⚡</span>}>Right Icon</Button>
        </Section>
      </div>

      {/* Text Section */}
      <div className="space-y-8">
        <Text type="SubHeader" size="xl" className="border-b pb-2">
          Text Variants
        </Text>

        <div className="space-y-4">
          <Text type="Header" size="xl">
            Welcome to the Dashboard
          </Text>

          <Text type="SubHeader" size="lg">
            Manage your account settings
          </Text>

          <Text type="Paragraph">
            This is a sample paragraph showing how base text styles look. You can
            still add custom <code>className</code> for tweaks.
          </Text>

          <div className="flex items-center gap-4">
            <Text type="Highlight" size="sm">
              Highlighted
            </Text>
            <Text type="Label" size="sm">
              Label Example
            </Text>
          </div>

          <div className="bg-gray-900 p-4 rounded">
            <Text type="Inverted" size="md">
              Inverted on a dark container — text is white.
            </Text>
          </div>

          <Text type="Inverted" invertedWithBg size="md">
            Inverted with its own dark background
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TestComponentsPage;

import { useState } from 'react';
import { ArrowLeft, Copy, Check, Play, Palette, Type, Layout, Zap, Box, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { haptics } from '../utils/haptics';
import { motion } from 'motion/react';

interface ComponentLibraryPageProps {
  onNavigate: (page: string) => void;
}

export function ComponentLibraryPage({ onNavigate }: ComponentLibraryPageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'components' | 'animations'>('design');

  const copyToClipboard = (code: string, id: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(id);
        haptics.medium();
        setTimeout(() => setCopiedCode(null), 2000);
      }).catch((err) => {
        console.error('Clipboard API failed:', err);
        // Fallback to older method
        fallbackCopyToClipboard(code, id);
      });
    } else {
      // Use fallback for unsupported browsers
      fallbackCopyToClipboard(code, id);
    }
  };

  const fallbackCopyToClipboard = (text: string, id: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedCode(id);
      haptics.medium();
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => {
            haptics.light();
            onNavigate('dashboard');
          }}
          className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 dark:text-white mb-2">Component Library</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Complete design system documentation for Screndly
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-[#333333]">
        <button
          onClick={() => setActiveTab('design')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'design'
              ? 'border-[#ec1e24] text-gray-900 dark:text-white'
              : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Design Tokens</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'components'
              ? 'border-[#ec1e24] text-gray-900 dark:text-white'
              : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            <span>UI Components</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('animations')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'animations'
              ? 'border-[#ec1e24] text-gray-900 dark:text-white'
              : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Animations</span>
          </div>
        </button>
      </div>

      {/* Design Tokens Tab */}
      {activeTab === 'design' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Brand Colors */}
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Brand Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="w-full h-24 bg-[#ec1e24] rounded-lg shadow-sm"></div>
                <div>
                  <p className="text-gray-900 dark:text-white">Brand Red</p>
                  <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">--brand-red: #ec1e24</code>
                </div>
              </div>
              <div className="space-y-3">
                <div className="w-full h-24 bg-[#000000] rounded-lg border border-gray-200 dark:border-[#333333]"></div>
                <div>
                  <p className="text-gray-900 dark:text-white">Brand Black</p>
                  <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">--brand-black: #000000</code>
                </div>
              </div>
              <div className="space-y-3">
                <div className="w-full h-24 bg-[#FFFFFF] rounded-lg border border-gray-200"></div>
                <div>
                  <p className="text-gray-900 dark:text-white">Brand White</p>
                  <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">--brand-white: #FFFFFF</code>
                </div>
              </div>
            </div>
          </div>

          {/* Spacing Tokens */}
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Spacing Scale</h3>
            <div className="space-y-3">
              {[
                { name: 'xs', value: '4px', var: '--spacing-xs' },
                { name: 'sm', value: '8px', var: '--spacing-sm' },
                { name: 'md', value: '12px', var: '--spacing-md' },
                { name: 'lg', value: '16px', var: '--spacing-lg' },
                { name: 'xl', value: '24px', var: '--spacing-xl' },
                { name: '2xl', value: '32px', var: '--spacing-2xl' },
                { name: '3xl', value: '48px', var: '--spacing-3xl' },
                { name: '4xl', value: '64px', var: '--spacing-4xl' },
              ].map((spacing) => (
                <div key={spacing.name} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-900 dark:text-white">{spacing.name}</div>
                  <div className="bg-[#ec1e24]" style={{ width: spacing.value, height: '24px' }}></div>
                  <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{spacing.value}</code>
                  <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{spacing.var}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Border Radius</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'xs', value: '4px', var: '--radius-xs' },
                { name: 'sm', value: '8px', var: '--radius-sm' },
                { name: 'md', value: '12px', var: '--radius-md' },
                { name: 'lg', value: '16px', var: '--radius-lg' },
                { name: 'xl', value: '24px', var: '--radius-xl' },
                { name: '2xl', value: '32px', var: '--radius-2xl' },
              ].map((radius) => (
                <div key={radius.name} className="space-y-2">
                  <div
                    className="w-full h-16 bg-[#ec1e24]"
                    style={{ borderRadius: radius.value }}
                  ></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{radius.name}</p>
                    <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{radius.value}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Shadow Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'sm', var: '--shadow-sm' },
                { name: 'md', var: '--shadow-md' },
                { name: 'lg', var: '--shadow-lg' },
                { name: 'xl', var: '--shadow-xl' },
                { name: '2xl', var: '--shadow-2xl' },
                { name: 'red', var: '--shadow-red' },
              ].map((shadow) => (
                <div key={shadow.name} className="space-y-3">
                  <div
                    className="w-full h-24 bg-white dark:bg-[#1A1A1A] rounded-lg"
                    style={{ boxShadow: `var(${shadow.var})` }}
                  ></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{shadow.name}</p>
                    <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{shadow.var}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transitions */}
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Transition Timings</h3>
            <div className="space-y-3">
              {[
                { name: 'fast', value: '150ms', var: '--transition-fast' },
                { name: 'base', value: '200ms', var: '--transition-base' },
                { name: 'slow', value: '300ms', var: '--transition-slow' },
                { name: 'bounce', value: '400ms', var: '--transition-bounce' },
              ].map((transition) => (
                <div key={transition.name} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-900 dark:text-white">{transition.name}</div>
                  <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{transition.value}</code>
                  <code className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{transition.var}</code>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* UI Components Tab */}
      {activeTab === 'components' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Buttons */}
          <ComponentSection
            title="Buttons"
            description="Primary action buttons with flat design aesthetic"
            code={`<Button>Primary Button</Button>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          >
            <div className="flex flex-wrap gap-3">
              <Button>Primary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button disabled>Disabled Button</Button>
            </div>
          </ComponentSection>

          {/* Inputs */}
          <ComponentSection
            title="Input Fields"
            description="Text inputs with proper focus states"
            code={`<Input placeholder="Enter text..." />`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          >
            <div className="space-y-3 max-w-md">
              <Input placeholder="Default input" />
              <Input placeholder="With value" defaultValue="Sample text" />
              <Input placeholder="Disabled input" disabled />
            </div>
          </ComponentSection>

          {/* Switches */}
          <ComponentSection
            title="Switch Toggle"
            description="Toggle switches for boolean settings"
            code={`<Switch />`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          >
            <div className="flex gap-4">
              <Switch defaultChecked />
              <Switch />
            </div>
          </ComponentSection>

          {/* Select Dropdowns */}
          <ComponentSection
            title="Select Dropdown"
            description="Dropdown menus with brand red highlight"
            code={`<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          >
            <div className="max-w-md">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </ComponentSection>

          {/* Status Labels */}
          <ComponentSection
            title="Status Labels"
            description="Consistent status badges used throughout the app"
            code={`<span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-[#1f1f1f] text-gray-700 dark:text-[#9CA3AF]">
  success
</span>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          >
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-[#1f1f1f] text-gray-700 dark:text-[#9CA3AF]">
                success
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FEE2E2] dark:bg-[#991B1B] text-[#991B1B] dark:text-[#FEE2E2]">
                failed
              </span>
              <span className="px-3 py-1 rounded-full bg-[#ec1e24] text-white">
                active
              </span>
            </div>
          </ComponentSection>

          {/* Cards */}
          <ComponentSection
            title="Cards"
            description="Modular card components with soft shadows"
            code={`<div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm p-6">
  Card content
</div>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          >
            <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm p-6">
              <h4 className="text-gray-900 dark:text-white mb-2">Card Title</h4>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                This is a sample card component with the standard styling used throughout Screndly.
              </p>
            </div>
          </ComponentSection>
        </motion.div>
      )}

      {/* Animations Tab */}
      {activeTab === 'animations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <AnimationDemo
            title="Fade In"
            description="Subtle fade and translate up animation"
            className="animate-fade-in"
            code={`<div className="animate-fade-in">Content</div>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />

          <AnimationDemo
            title="Slide In (Left/Right)"
            description="Slide from left or right with fade"
            className="animate-slide-in-left"
            code={`<div className="animate-slide-in-left">Content</div>
<div className="animate-slide-in-right">Content</div>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />

          <AnimationDemo
            title="Scale In"
            description="Zoom in effect with fade"
            className="animate-scale-in"
            code={`<div className="animate-scale-in">Content</div>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />

          <AnimationDemo
            title="Slide Up"
            description="Slide up from bottom"
            className="animate-slide-up"
            code={`<div className="animate-slide-up">Content</div>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />

          <AnimationDemo
            title="Rotate Scale In"
            description="Combined rotation and scale with bounce"
            className="animate-rotate-scale-in"
            code={`<div className="animate-rotate-scale-in">Content</div>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />

          <AnimationDemo
            title="Glow Pulse"
            description="Pulsing red glow effect for notifications"
            className="animate-glow-pulse"
            code={`<div className="animate-glow-pulse">Content</div>`}
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />

          {/* Motion/React Examples */}
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Motion (Framer Motion) Examples</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Hover Scale Effect</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#ec1e24] text-white p-4 rounded-lg cursor-pointer inline-block"
                >
                  Hover me
                </motion.div>
              </div>

              <div>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Tap Animation</p>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#ec1e24] text-white p-4 rounded-lg cursor-pointer inline-block"
                >
                  Click me
                </motion.div>
              </div>

              <div className="mt-4">
                <CodeBlock
                  code={`import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>`}
                  id="motion-example"
                  copiedCode={copiedCode}
                  onCopy={copyToClipboard}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Responsive Breakpoints Documentation */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
        <h3 className="text-gray-900 dark:text-white mb-4">Responsive Breakpoints</h3>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-4">
          Screndly uses Tailwind's default breakpoint system for responsive design:
        </p>
        <div className="space-y-3">
          {[
            { name: 'sm (Mobile)', value: '640px', usage: 'Small tablets and large phones' },
            { name: 'md (Tablet)', value: '768px', usage: 'Tablets and small desktops' },
            { name: 'lg (Desktop)', value: '1024px', usage: 'Desktops and laptops (sidebar appears)' },
            { name: 'xl (Large Desktop)', value: '1280px', usage: 'Large desktop screens' },
            { name: '2xl (Extra Large)', value: '1536px', usage: 'Extra large desktop screens' },
          ].map((breakpoint) => (
            <div key={breakpoint.name} className="border-l-4 border-[#ec1e24] pl-4">
              <p className="text-gray-900 dark:text-white">{breakpoint.name}</p>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                <code>{breakpoint.value}</code> - {breakpoint.usage}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <CodeBlock
            code={`/* Mobile-first approach */
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

/* Hide sidebar on mobile */
<nav className="hidden lg:block">
  Sidebar
</nav>`}
            id="responsive-example"
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface ComponentSectionProps {
  title: string;
  description: string;
  code: string;
  copiedCode: string | null;
  onCopy: (code: string, id: string) => void;
  children: React.ReactNode;
}

function ComponentSection({ title, description, code, copiedCode, onCopy, children }: ComponentSectionProps) {
  const id = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
      <h3 className="text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4">{description}</p>
      
      {/* Preview */}
      <div className="bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333333] rounded-lg p-6 mb-4">
        {children}
      </div>

      {/* Code */}
      <CodeBlock code={code} id={id} copiedCode={copiedCode} onCopy={onCopy} />
    </div>
  );
}

interface AnimationDemoProps {
  title: string;
  description: string;
  className: string;
  code: string;
  copiedCode: string | null;
  onCopy: (code: string, id: string) => void;
}

function AnimationDemo({ title, description, className, code, copiedCode, onCopy }: AnimationDemoProps) {
  const [key, setKey] = useState(0);
  const id = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{description}</p>
        </div>
        <button
          onClick={() => {
            haptics.light();
            setKey(prev => prev + 1);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#ec1e24] text-white rounded-lg hover:bg-[#d01a20]"
        >
          <Play className="w-4 h-4" />
          <span className="text-sm">Replay</span>
        </button>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333333] rounded-lg p-12 mb-4 flex items-center justify-center">
        <div key={key} className={`${className} bg-[#ec1e24] text-white px-6 py-3 rounded-lg`}>
          Animation Preview
        </div>
      </div>

      {/* Code */}
      <CodeBlock code={code} id={id} copiedCode={copiedCode} onCopy={onCopy} />
    </div>
  );
}

interface CodeBlockProps {
  code: string;
  id: string;
  copiedCode: string | null;
  onCopy: (code: string, id: string) => void;
}

function CodeBlock({ code, id, copiedCode, onCopy }: CodeBlockProps) {
  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          haptics.medium();
          onCopy(code, id);
        }}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        {copiedCode === id ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
    </div>
  );
}

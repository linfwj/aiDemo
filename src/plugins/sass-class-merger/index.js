const postcss = require('postcss');
const sass = require('sass');

// Helper function to parse padding/margin values
function parseSpacing(value) {
  if (!value) return null;
  const values = value.split(' ').map(v => v.trim());
  if (values.length === 1) {
    return {
      top: values[0],
      right: values[0],
      bottom: values[0],
      left: values[0]
    };
  } else if (values.length === 2) {
    return {
      top: values[0],
      right: values[1],
      bottom: values[0],
      left: values[1]
    };
  } else if (values.length === 4) {
    return {
      top: values[0],
      right: values[1],
      bottom: values[2],
      left: values[3]
    };
  }
  return null;
}

// Main plugin function
module.exports = function() {
  return {
    postcssPlugin: 'sass-luban-class-merger',
    Once(root) {
      const lubanClasses = new Map();
      
      // First pass: collect all Luban classes
      root.walkRules(rule => {
        rule.selectors.forEach(selector => {
          if (selector.startsWith('.Luban')) {
            const className = selector.substring(1);
            if (!lubanClasses.has(className)) {
              lubanClasses.set(className, {
                padding: {},
                margin: {},
                rule: rule
              });
            }
            
            rule.walkDecls(decl => {
              const classData = lubanClasses.get(className);
              
              if (decl.prop === 'padding') {
                classData.padding = { ...classData.padding, ...parseSpacing(decl.value) };
              } else if (decl.prop.startsWith('padding-')) {
                const direction = decl.prop.replace('padding-', '');
                classData.padding[direction] = decl.value;
              } else if (decl.prop === 'margin') {
                classData.margin = { ...classData.margin, ...parseSpacing(decl.value) };
              } else if (decl.prop.startsWith('margin-')) {
                const direction = decl.prop.replace('margin-', '');
                classData.margin[direction] = decl.value;
              }
            });
          }
        });
      });
      
      // Second pass: merge Luban classes
      const classEntries = Array.from(lubanClasses.entries());
      for (let i = 0; i < classEntries.length; i++) {
        for (let j = i + 1; j < classEntries.length; j++) {
          const [class1Name, class1Data] = classEntries[i];
          const [class2Name, class2Data] = classEntries[j];
          
          // Create merged class name
          const mergedClassName = `Luban${class1Name.substring(5)}${class2Name.substring(5)}Merged`;
          
          // Merge padding
          const mergedPadding = {
            top: class2Data.padding.top || class1Data.padding.top || 'inherit',
            right: class2Data.padding.right || class1Data.padding.right || 'inherit',
            bottom: class2Data.padding.bottom || class1Data.padding.bottom || 'inherit',
            left: class2Data.padding.left || class1Data.padding.left || 'inherit'
          };
          
          // Merge margin
          const mergedMargin = {
            top: class2Data.margin.top || class1Data.margin.top || 'inherit',
            right: class2Data.margin.right || class1Data.margin.right || 'inherit',
            bottom: class2Data.margin.bottom || class1Data.margin.bottom || 'inherit',
            left: class2Data.margin.left || class1Data.margin.left || 'inherit'
          };
          
          // Create new rule with merged properties
          const mergedRule = postcss.rule({ selector: `.${mergedClassName}` });
          
          // Add padding properties
          Object.entries(mergedPadding).forEach(([direction, value]) => {
            mergedRule.append({ prop: `padding-${direction}`, value });
          });
          
          // Add margin properties
          Object.entries(mergedMargin).forEach(([direction, value]) => {
            mergedRule.append({ prop: `margin-${direction}`, value });
          });
          
          // Add the merged rule to the CSS
          root.append(mergedRule);
        }
      }
    }
  };
};

module.exports.postcss = true;

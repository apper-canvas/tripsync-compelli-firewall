const Text = ({ children, className = '', as = 'p' }) => {
        const Component = as
        return (
          <Component className={className}>
            {children}
          </Component>
        )
      }

      export default Text
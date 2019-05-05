import { h } from 'hyperapp';

export const Button = (props, children) => (
  <button class="btn" {...props}>{children}</button>
);

export const ButtonPrimary = (props, children) => (
  <Button class="btn btn-primary" {...props}>{children}</Button>
);
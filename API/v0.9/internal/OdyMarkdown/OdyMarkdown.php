<?php
namespace OdyMarkdown;

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

use \cebe\markdown\GithubMarkdown;

class OdyMarkdown extends GithubMarkdown
{
	protected function renderLink($block)
	{
		return $this->renderAbsy($block['text']) . ' (<a href="' . htmlspecialchars($block['url'], ENT_COMPAT | ENT_HTML401, 'UTF-8') . '">' . htmlspecialchars($block['url'], ENT_COMPAT | ENT_HTML401, 'UTF-8') . '</a>) ';
	}

    // Generic functions for command parsing
    private function identifyCommand($line, $command)
    {
        if (strncmp($line, '!' . $command, strlen($command) + 1) === 0)
        {
            return true;
        }
        return false;
    }

    private function consumeCommand($lines, $current, $command)
    {
        $block = [$command];
        $line = rtrim($lines[$current]);
        $start = strpos($line, '[', strlen($command) + 1) + 1;
        if($start !== false)
        {
            $stop = strpos($line, ']', $start);
            if($stop !== false)
            {
                $argumentString = substr($line, $start, $stop - $start);
                $next = $current;
            }
            else
            {
                $argumentString = substr($line, $start);
                for($i = $current + 1; $i < count($lines); ++$i)
                {
                    $stop = strpos($lines[$i], "]");
                    if($stop !== false)
                    {
                        $argumentString .= substr($lines[$i], 0, $stop);
                        $next = $i;
                        break;
                    }
                    else
                    {
                        $argumentString .= $lines[$i];
                    }
                }
            }
        }
        $argumentString = str_replace(' ', '', $argumentString);
        $argumentArray = explode(',', $argumentString);
        foreach($argumentArray as $arg)
        {
            $keyval = explode('=', $arg);
            if(count($keyval) !== 2)
            {
                break;
            }
            $block[$keyval[0]] = $keyval[1];
        }
        return [$block, $next];
    }

    // Notes extension
    protected function identifyNotes($line)
    {
        return $this->identifyCommand($line, 'notes');
    }

    protected function consumeNotes($lines, $current)
    {
        return $this->consumeCommand($lines, $current, 'notes');
    }

    protected function renderNotes($block)
    {
        if(isset($block['style']) and $block['style'] === 'dotted')
        {
            $style = 'dotted';
        }
        else
        {
            $style = 'blank';
        }
        if(isset($block['height']))
        {
            if($block["height"] === 'eop')
            {
                $height = 'page';
            }
            else
            {
                $height = 'lines{' . $block['height'] . '}';
            }
        }
        else
        {
            $height = 'line';
        }
        return "\\" . $style . $height . "\n";
    }
}

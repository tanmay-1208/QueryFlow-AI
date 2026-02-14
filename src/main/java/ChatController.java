import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.web.bind.annotation.*;

@RestController
public class ChatController {
    private final OllamaChatModel chatModel;

    public ChatController(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String message) {
        return chatModel.call(message);
    }
}
